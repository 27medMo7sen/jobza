import {
  Injectable,
  NotAcceptableException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './files.model';
import { Model, Types } from 'mongoose';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { AuthService } from 'src/auth/auth.service';
import { WorkerProfileStatusService } from 'src/worker/worker-profile-status.service';
import { EmployerProfileStatusService } from 'src/employer/employer-profile-status.service';
import { AgencyProfileStatusService } from 'src/agency/agency-profile-status.service';
import { Auth } from 'src/auth/auth.model';
@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<File>,
    @InjectModel('Auth') private authModel: Model<Auth>,
    private awsS3Service: AwsS3Service,
    private authService: AuthService,
    @Inject(forwardRef(() => WorkerProfileStatusService))
    private workerProfileStatusService: WorkerProfileStatusService,
    @Inject(forwardRef(() => EmployerProfileStatusService))
    private employerProfileStatusService: EmployerProfileStatusService,
    @Inject(forwardRef(() => AgencyProfileStatusService))
    private agencyProfileStatusService: AgencyProfileStatusService,
  ) {}

  async uploadFile(
    userId: Types.ObjectId,
    role: string,
    file: Express.Multer.File,
    type: string,
    label: string,
  ): Promise<File | any> {
    const existingFile = await this.fileModel.findOne({ userId, label });

    if (existingFile) {
      if (label === 'signature') {
        throw new NotAcceptableException('Signature already exists');
      }
      await this.awsS3Service.deleteFile(existingFile?.s3Key || '');
      if (label !== 'profile_photo')
        await this.fileModel.deleteOne({ _id: existingFile._id });
    }

    const folder = type === 'picture' ? 'pictures' : 'documents';
    const key = `${userId}/${folder}/${Date.now()}-${file.originalname}`;

    const url = await this.awsS3Service.uploadFile(key, file);

    if (label === 'profile_photo') {
      return await this.authService.updateProfilePhoto(userId, url, key, role);
    } else {
      const savedFile = new this.fileModel({
        userId,
        fileType: type,
        fileName: file.originalname,
        label: label,
        s3Key: key,
        url,
        size: file.size,
      });
      savedFile.save();

      // Trigger profile status update based on role
      if (role === 'worker') {
        await this.workerProfileStatusService.handleFileUpload(userId);
      } else if (role === 'employer') {
        await this.employerProfileStatusService.handleFileUpload(userId);
      } else if (role === 'agency') {
        await this.agencyProfileStatusService.handleFileUpload(userId);
      }

      return savedFile;
    }
  }

  async listUserFiles(userId: Types.ObjectId) {
    const ret = await this.fileModel
      .find({ userId: userId.toString() })
      .select('fileName label url s3Key size fileType status rejectionReason');
    console.log('ret', ret);
    const filesByLabel = ret.reduce(
      (acc, file) => {
        acc[file.label] = file;
        return acc;
      },
      {} as Record<string, any>,
    );

    return filesByLabel;
  }

  async listUserFilesByUsername(username: string) {
    // First find the user by username
    const user = await this.authModel.findOne({ userName: username });
    if (!user) {
      throw new Error('User not found');
    }
    console.log('user in listUserFilesByUsername', user);

    // Then get their files
    return await this.listUserFiles(user._id);
  }

  async deleteFile(userId: Types.ObjectId, fileId: Types.ObjectId) {
    const file = await this.fileModel.findOne({ _id: fileId, userId });
    if (!file)
      throw new Error('File not found or does not belong to this user');

    await this.awsS3Service.deleteFile(file.s3Key);
    await this.fileModel.deleteOne({ _id: fileId });

    return { message: 'File deleted successfully', fileId };
  }

  async deleteFileByUrl(userId: Types.ObjectId, fileUrl: string) {
    const file = await this.fileModel.findOne({ userId, url: fileUrl });
    if (!file) {
      return { message: 'File not found', deleted: false };
    }

    await this.awsS3Service.deleteFile(file.s3Key);
    await this.fileModel.deleteOne({ _id: file._id });

    return { message: 'File deleted successfully', deleted: true };
  }

  async deleteFiles(userId: Types.ObjectId, fileUrls: string[]) {
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
    return results;
  }

  /**
   * Update file status (for admin approval/rejection)
   */
  async updateFileStatus(
    fileId: Types.ObjectId,
    status: string,
    rejectionReason?: string,
  ): Promise<File | null> {
    const updateData: any = { status };
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedFile = await this.fileModel.findByIdAndUpdate(
      fileId,
      updateData,
      { new: true },
    );

    if (updatedFile) {
      // Get the user's role to determine if we need to update profile status
      const auth = await this.authModel.findById(updatedFile.userId);
      if (auth) {
        if (status === 'rejected') {
          if (auth.role === 'worker') {
            await this.workerProfileStatusService.handleFileRejection(
              updatedFile.userId,
            );
          } else if (auth.role === 'employer') {
            await this.employerProfileStatusService.handleFileRejection(
              updatedFile.userId,
            );
          } else if (auth.role === 'agency') {
            await this.agencyProfileStatusService.handleFileRejection(
              updatedFile.userId,
            );
          }
        } else if (status === 'approved') {
          if (auth.role === 'worker') {
            await this.workerProfileStatusService.handleFileApproval(
              updatedFile.userId,
            );
          } else if (auth.role === 'employer') {
            await this.employerProfileStatusService.handleFileApproval(
              updatedFile.userId,
            );
          } else if (auth.role === 'agency') {
            await this.agencyProfileStatusService.handleFileApproval(
              updatedFile.userId,
            );
          }
        }
      }
    }

    return updatedFile;
  }

  /**
   * Get profile completeness details for admin/debugging purposes
   */
  async getProfileCompletenessDetails(userId: Types.ObjectId, role: string) {
    if (role === 'worker') {
      return await this.workerProfileStatusService.getProfileCompletenessDetails(
        userId,
      );
    } else if (role === 'employer') {
      return await this.employerProfileStatusService.getProfileCompletenessDetails(
        userId,
      );
    } else if (role === 'agency') {
      return await this.agencyProfileStatusService.getProfileCompletenessDetails(
        userId,
      );
    }
    throw new Error(`Unknown role: ${role}`);
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
