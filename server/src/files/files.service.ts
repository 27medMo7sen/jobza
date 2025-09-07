import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './files.model';
import { Model } from 'mongoose';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { AuthService } from 'src/auth/auth.service';
import { fileLabel } from './files.model';
import { NotFoundException } from '@nestjs/common';
import { Auth } from 'src/auth/auth.model';
import { Types } from 'mongoose';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<File>,
    private awsS3Service: AwsS3Service,
    private authService: AuthService,
    @InjectModel(Auth.name) private authModel: Model<Auth>,
  ) {}

  async uploadFile(
    userId: string,
    role: string,
    file: Express.Multer.File,
    type: string,
    label: string,
  ) {
    const existingFile = await this.fileModel.findOne({ userId, label });

    if (existingFile) {
      if (label === 'signature') {
        throw new NotAcceptableException('Signature already exists');
      }
      await this.awsS3Service.deleteFile(existingFile?.s3Key || '');
      await this.fileModel.deleteOne({ _id: existingFile._id });
    }

    const folder = type === 'picture' ? 'pictures' : 'documents';
    const key = `${userId}/${folder}/${Date.now()}-${file.originalname}`;

    const url = await this.awsS3Service.uploadFile(key, file);

    const savedFile = new this.fileModel({
      userId,
      fileType: type,
      fileName: file.originalname,
      label: label,
      s3Key: key,
      url,
      size: file.size,
    });
    
    const savedFileResult = await savedFile.save();
    
    if (label === 'signature') {
      await this.authService.signatureUploaded(userId);
    }
    
    // check for all files existing in the database for the user AFTER saving
    const userStatus = await this.updateUserStatusBasedOnDocuments(userId, role);
    console.log('userStatus in file service uploadFile', userStatus);
    
    return savedFileResult;
  }

  async listUserFiles(userId: string) {
    const ret = await this.fileModel
      .find({ userId })
      .select(
        'fileName label url s3Key size fileType status rejectionReason -_id',
      );

    const filesByLabel = ret.reduce(
      (acc, file) => {
        acc[file.label] = file;
        return acc;
      },
      {} as Record<string, any>,
    );

    return filesByLabel;
  }

  async deleteFile(userId: string, role: string, fileId: string) {
    const file = await this.fileModel.findOne({ _id: fileId, userId });
    if (!file)
      throw new Error('File not found or does not belong to this user');

    await this.awsS3Service.deleteFile(file.s3Key);
    await this.fileModel.deleteOne({ _id: fileId });
    
    const userStatus = await this.updateUserStatusBasedOnDocuments(userId, role);
    console.log('userStatus', userStatus);
    return { message: 'File deleted successfully', fileId };
  }

  async deleteFileByUrl(userId: string, fileUrl: string) {
    const file = await this.fileModel.findOne({ userId, url: fileUrl });
    if (!file) {
      return { message: 'File not found', deleted: false };
    }

    await this.awsS3Service.deleteFile(file.s3Key);
    await this.fileModel.deleteOne({ _id: file._id });
    // const userStatus = await this.updateUserStatusBasedOnDocuments(userId, role);
    // console.log('userStatus', userStatus);
    return { message: 'File deleted successfully', deleted: true };
  }

  async deleteFiles(userId: string, fileUrls: string[]) {
    const results: Array<{
      fileUrl: string;
      deleted: boolean;
      message?: string;
      error?: string;
    }> = [];
    for (const fileUrl of fileUrls) {
      try {
        const result = await this.deleteFileByUrl(userId, fileUrl);
        results.push({
          fileUrl,
          deleted: result.deleted,
          message: result.message,
        });
      } catch (error: any) {
        results.push({
          fileUrl,
          error: error.message || 'Unknown error',
          deleted: false,
        });
      }
    }
    // const userStatus = await this.updateUserStatusBasedOnDocuments(userId, role);
    // console.log('userStatus', userStatus);
    return results;
  }
  
  
  private requiredDocumentsMap: Record<string, string[]> = {
    worker: [
      fileLabel.PASSPORT,
      fileLabel.RESIDENCE_PERMIT,
      fileLabel.FACE_PHOTO,
      fileLabel.FULL_BODY_PHOTO,
      fileLabel.MEDICAL_CERTIFICATE,
      fileLabel.EDUCATIONAL_CERTIFICATE,
      fileLabel.EXPERIENCE_LETTER,
      fileLabel.POLICE_CLEARANCE_CERTIFICATE,
      fileLabel.SIGNATURE,
    ],
    employer: [
      // fileLabel.FACE_PHOTO,
      // fileLabel.NATIONAL_ID,
      // fileLabel.PROOF_OF_ADDRESS,
    ],
    agency: [
      // fileLabel.FACE_PHOTO,
      // fileLabel.BUSINESS_LICENSE,
      // fileLabel.REGISTRATION_CERTIFICATE,
    ],
  };
  
  private determineUserStatus(role: string, documents: File[]): string {
    const requiredLabels = this.requiredDocumentsMap[role] ?? this.requiredDocumentsMap['worker'];
    console.log('requiredLabels in file service determineUserStatus', requiredLabels, role, documents);
    // 1. Check if all required docs are present
    const presentLabels = documents.map((doc) => doc.label);
    console.log('presentLabels:', presentLabels);
    const hasAllRequired = requiredLabels.every((label) =>
      presentLabels.includes(label as any),
    );
    console.log('hasAllRequired:', hasAllRequired);
    if (!hasAllRequired) return 'not_completed';
  
    // 2. All required docs are present → check statuses
    const documentStatuses = documents.map(doc => ({ label: doc.label, status: doc.status }));
    console.log('documentStatuses:', documentStatuses);
    
    if (documents.some((doc) => doc.status === 'rejected')) return 'rejected';
    if (documents.every((doc) => doc.status === 'approved')) return 'approved';
  
    // 3. Otherwise, pending (when all docs are present but not all approved)
    console.log('Returning pending - all docs present but not all approved');
    return 'pending';
  }

  // Update worker status from documents
  async updateUserStatusBasedOnDocuments(userId: string, role: string) {
    const documents = await this.fileModel.find({ userId: userId.toString() });
    if (documents.length === 0) {
      return { message: 'No documents found for this user' };
    }

    console.log('documents in updateUserStatusBasedOnDocuments', documents);

    const newStatus = this.determineUserStatus(role, documents);

    const user = await this.authModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { status: newStatus },
      { new: true },
    );

    if (!user) throw new NotFoundException('user not found for this user');

    return {
      userId: user._id,
      status: newStatus,
      updated: true,
    };
  }

  // async getFileMetadata(userId: string, fileUrl: string) {
  //   const file = await this.fileModel.findOne({ userId, url: fileUrl });
  //   if (!file) {
  //     return null;
  //   }
  //   return {
  //     fileName: file.fileName,
  //     fileType: file.fileType,
  //     label: file.label,
  //     issuanceDate: file.issuanceDate,
  //     expirationDate: file.expirationDate,
  //     s3Key: file.s3Key,
  //     url: file.url,
  //   };
  // }

  // async getUserFilesByType(userId: string, fileType: string) {
  //   return this.fileModel.find({ userId, fileType }).select('url fileName label -_id');
  // }

  // async replaceFile(
  //   userId: string,
  //   oldFileUrl: string,
  //   newFile: Express.Multer.File,
  //   type: string,
  //   label: string,
  //   issuanceDate?: Date,
  //   expirationDate?: Date,
  // ) {
  //   const deleteResult = await this.deleteFileByUrl(userId, oldFileUrl);
  //   if (!deleteResult.deleted) {
  //     throw new Error('Failed to delete old file');
  //   }
  //   const newFileData = await this.uploadFile(
  //     userId,
  //     newFile,
  //     type,
  //     label,
  //     issuanceDate || new Date(),
  //     expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  //   );
  //   return {
  //     message: 'File replaced successfully',
  //     oldFile: oldFileUrl,
  //     newFile: newFileData,
  //   };
  // }
}
