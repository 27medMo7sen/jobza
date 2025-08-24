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
    }, {});

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
}
