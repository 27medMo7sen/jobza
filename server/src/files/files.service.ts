import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './files.model';
import { Model } from 'mongoose';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<File>,
    private awsS3Service: AwsS3Service,
  ) {}

  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    type: string,
    label: string,
    issuanceDate: Date,
    expirationDate: Date,
  ) {
    const folder = type === 'picture' ? 'pictures' : 'documents';
    const key = `${userId}/${folder}/${Date.now()}-${file.originalname}`;

    const url = await this.awsS3Service.uploadFile(key, file);

    const savedFile = new this.fileModel({
      userId,
      fileType: type,
      fileName: file.originalname,
      label: label,
      issuanceDate,
      expirationDate,
      s3Key: key,
      url,
    });

    return savedFile.save();
  }

  async listUserFiles(userId: string) {
    const ret = await this.fileModel
      .find({ userId })
      .select('fileName label issuanceDate expirationDate url s3Key -_id');

    const filesByLabel = ret.reduce((acc, file) => {
      acc[file.label] = file;
      return acc;
    }, {} as Record<string, any>);

    return filesByLabel;
  }

  async deleteFile(userId: string, fileId: string) {
    const file = await this.fileModel.findOne({ _id: fileId, userId });
    if (!file)
      throw new Error('File not found or does not belong to this user');

    await this.awsS3Service.deleteFile(file.s3Key);
    await this.fileModel.deleteOne({ _id: fileId });

    return { message: 'File deleted successfully', fileId };
  }

  async deleteFileByUrl(userId: string, fileUrl: string) {
    const file = await this.fileModel.findOne({ userId, url: fileUrl });
    if (!file) {
      return { message: 'File not found', deleted: false };
    }

    await this.awsS3Service.deleteFile(file.s3Key);
    await this.fileModel.deleteOne({ _id: file._id });

    return { message: 'File deleted successfully', deleted: true };
  }

  async deleteFiles(userId: string, fileUrls: string[]) {
    const results: Array<{ fileUrl: string; deleted: boolean; message?: string; error?: string }> = [];
    for (const fileUrl of fileUrls) {
      try {
        const result = await this.deleteFileByUrl(userId, fileUrl);
        results.push({ fileUrl, deleted: result.deleted, message: result.message });
      } catch (error: any) {
        results.push({ fileUrl, error: error.message || 'Unknown error', deleted: false });
      }
    }
    return results;
  }

  async getFileMetadata(userId: string, fileUrl: string) {
    const file = await this.fileModel.findOne({ userId, url: fileUrl });
    if (!file) {
      return null;
    }
    return {
      fileName: file.fileName,
      fileType: file.fileType,
      label: file.label,
      issuanceDate: file.issuanceDate,
      expirationDate: file.expirationDate,
      s3Key: file.s3Key,
      url: file.url,
    };
  }

  async getUserFilesByType(userId: string, fileType: string) {
    return this.fileModel.find({ userId, fileType }).select('url fileName label -_id');
  }

  async replaceFile(
    userId: string,
    oldFileUrl: string,
    newFile: Express.Multer.File,
    type: string,
    label: string,
    issuanceDate?: Date,
    expirationDate?: Date,
  ) {
    const deleteResult = await this.deleteFileByUrl(userId, oldFileUrl);
    if (!deleteResult.deleted) {
      throw new Error('Failed to delete old file');
    }
    const newFileData = await this.uploadFile(
      userId,
      newFile,
      type,
      label,
      issuanceDate || new Date(),
      expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    );
    return {
      message: 'File replaced successfully',
      oldFile: oldFileUrl,
      newFile: newFileData,
    };
  }
}
