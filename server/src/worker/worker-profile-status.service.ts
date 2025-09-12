import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker } from './worker.model';
import { File } from '../files/files.model';
import { Auth, status } from '../auth/auth.model';
import { fileLabel } from '../files/files.model';

@Injectable()
export class WorkerProfileStatusService {
  constructor(
    @InjectModel('Worker') private readonly workerModel: Model<Worker>,
    @InjectModel('File') private readonly fileModel: Model<File>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
  ) {}

  // Required personal information fields for workers
  private readonly REQUIRED_PERSONAL_FIELDS = [
    'name',
    'phoneNumber',
    'country',
    'nationality',
    'gender',
  ];

  // Required document labels for workers
  private readonly REQUIRED_DOCUMENT_LABELS = [
    fileLabel.FACE_PHOTO,
    fileLabel.FULL_BODY_PHOTO,
    fileLabel.EDUCATIONAL_CERTIFICATE,
    fileLabel.MEDICAL_CERTIFICATE,
    fileLabel.EXPERIENCE_LETTER,
    fileLabel.POLICE_CLEARANCE_CERTIFICATE,
    fileLabel.SIGNATURE,
  ];

  /**
   * Check if all required personal information fields are filled
   */
  private isPersonalInfoComplete(worker: Worker): boolean {
    return this.REQUIRED_PERSONAL_FIELDS.every((field) => {
      const value = worker[field];
      return value !== null && value !== undefined && value !== '';
    });
  }

  /**
   * Check if all required documents are uploaded
   */
  private async areRequiredDocumentsUploaded(
    userId: Types.ObjectId,
  ): Promise<boolean> {
    const uploadedFiles = await this.fileModel.find({
      userId,
      label: { $in: this.REQUIRED_DOCUMENT_LABELS },
    });

    const uploadedLabels = uploadedFiles.map((file) => file.label);
    console.log('uploadedLabels', uploadedLabels);
    console.log('requiredLabels', this.REQUIRED_DOCUMENT_LABELS);

    const allUploaded = this.REQUIRED_DOCUMENT_LABELS.every((label) =>
      uploadedLabels.includes(label),
    );

    if (!allUploaded) {
      const missingLabels = this.REQUIRED_DOCUMENT_LABELS.filter(
        (label) => !uploadedLabels.includes(label),
      );
      console.log('Missing document labels:', missingLabels);
    }

    return allUploaded;
  }

  /**
   * Check if worker has at least one skill
   */
  private hasSkills(worker: Worker): boolean {
    return worker.skillSet && worker.skillSet.length > 0;
  }

  /**
   * Check if any uploaded file is rejected
   */
  private async hasRejectedFiles(userId: Types.ObjectId): Promise<boolean> {
    const rejectedFiles = await this.fileModel.findOne({
      userId,
      status: status.REJECTED,
    });
    return !!rejectedFiles;
  }

  /**
   * Check if all uploaded files are approved
   */
  private async areAllFilesApproved(userId: Types.ObjectId): Promise<boolean> {
    const files = await this.fileModel.find({
      userId,
      label: { $in: this.REQUIRED_DOCUMENT_LABELS },
    });

    if (files.length === 0) return false;

    return files.every((file) => file.status === status.APPROVED);
  }

  /**
   * Determine the current profile status based on all criteria
   */
  async determineProfileStatus(userId: Types.ObjectId): Promise<status> {
    let worker = await this.workerModel.findOne({ userId });
    if (!worker) {
      // If worker profile doesn't exist, create a basic one with required fields
      // Fetch email from Auth to satisfy Worker schema requirement
      const auth = await this.authModel
        .findById(userId)
        .select('email')
        .lean();

      if (auth?.email) {
        worker = new this.workerModel({ userId, email: auth.email });
        await worker.save();
      } else {
        // Cannot create Worker without required email; treat as incomplete profile
        return status.NOT_COMPLETED;
      }
    }

    // Check if any file is rejected - if so, entire profile is rejected
    const hasRejected = await this.hasRejectedFiles(userId);
    if (hasRejected) {
      return status.REJECTED;
    }

    // Check if all required personal info is complete
    const isPersonalComplete = this.isPersonalInfoComplete(worker);
    console.log('isPersonalComplete', isPersonalComplete);

    // Check if all required documents are uploaded
    const areDocumentsUploaded =
      await this.areRequiredDocumentsUploaded(userId);
    console.log('areDocumentsUploaded', areDocumentsUploaded);

    // Check if worker has skills
    const hasSkills = this.hasSkills(worker);
    console.log('hasSkills', hasSkills);

    // If any required field is missing, profile is not completed
    if (!isPersonalComplete || !areDocumentsUploaded || !hasSkills) {
      console.log('Status: NOT_COMPLETED - Missing requirements');
      console.log('Missing personal info:', !isPersonalComplete);
      console.log('Missing documents:', !areDocumentsUploaded);
      console.log('Missing skills:', !hasSkills);
      return status.NOT_COMPLETED;
    }

    // Check if all files are approved
    const areAllFilesApproved = await this.areAllFilesApproved(userId);

    if (areAllFilesApproved) {
      return status.APPROVED;
    } else {
      return status.PENDING;
    }
  }

  /**
   * Update worker profile status in Auth collection
   */
  async updateProfileStatus(
    userId: Types.ObjectId,
    newStatus: status,
  ): Promise<void> {
    // Update Auth collection status
    await this.authModel.findOneAndUpdate(
      { _id: userId },
      { status: newStatus },
      { new: true },
    );

    console.log(
      `Worker profile status updated to ${newStatus} for user ${userId}`,
    );
  }

  /**
   * Auto-update profile status based on current state
   */
  async autoUpdateProfileStatus(userId: Types.ObjectId): Promise<status> {
    const newStatus = await this.determineProfileStatus(userId);
    await this.updateProfileStatus(userId, newStatus);
    return newStatus;
  }

  /**
   * Handle file upload - re-evaluate status based on current state
   */
  async handleFileUpload(userId: Types.ObjectId): Promise<void> {
    // When a file is uploaded, re-evaluate the entire profile status
    const newStatus = await this.determineProfileStatus(userId);
    await this.updateProfileStatus(userId, newStatus);
  }

  /**
   * Handle file rejection - set status to rejected
   */
  async handleFileRejection(userId: Types.ObjectId): Promise<void> {
    await this.updateProfileStatus(userId, status.REJECTED);
  }

  /**
   * Handle file approval - check if all files are approved and update accordingly
   */
  async handleFileApproval(userId: Types.ObjectId): Promise<void> {
    const newStatus = await this.determineProfileStatus(userId);
    await this.updateProfileStatus(userId, newStatus);
  }

  /**
   * Handle profile information update - re-evaluate status
   */
  async handleProfileUpdate(userId: Types.ObjectId): Promise<void> {
    const newStatus = await this.determineProfileStatus(userId);
    await this.updateProfileStatus(userId, newStatus);
  }

  /**
   * Handle skills update - re-evaluate status
   */
  async handleSkillsUpdate(userId: Types.ObjectId): Promise<void> {
    const newStatus = await this.determineProfileStatus(userId);
    await this.updateProfileStatus(userId, newStatus);
  }

  /**
   * Get profile completeness details for debugging/admin purposes
   */
  async getProfileCompletenessDetails(userId: Types.ObjectId): Promise<{
    personalInfoComplete: boolean;
    documentsUploaded: boolean;
    hasSkills: boolean;
    hasRejectedFiles: boolean;
    allFilesApproved: boolean;
    currentStatus: status;
    missingFields: string[];
    missingDocuments: string[];
  }> {
    const worker = await this.workerModel.findOne({ userId });
    if (!worker) {
      throw new Error('Worker not found');
    }

    const personalInfoComplete = this.isPersonalInfoComplete(worker);
    const documentsUploaded = await this.areRequiredDocumentsUploaded(userId);
    const hasSkills = this.hasSkills(worker);
    const hasRejectedFiles = await this.hasRejectedFiles(userId);
    const allFilesApproved = await this.areAllFilesApproved(userId);
    const currentStatus = await this.determineProfileStatus(userId);

    // Find missing fields
    const missingFields = this.REQUIRED_PERSONAL_FIELDS.filter((field) => {
      const value = worker[field];
      return !value || value === '';
    });

    // Find missing documents
    const uploadedFiles = await this.fileModel.find({
      userId,
      label: { $in: this.REQUIRED_DOCUMENT_LABELS },
    });
    const uploadedLabels = uploadedFiles.map((file) => file.label);
    const missingDocuments = this.REQUIRED_DOCUMENT_LABELS.filter(
      (label) => !uploadedLabels.includes(label),
    );

    return {
      personalInfoComplete,
      documentsUploaded,
      hasSkills,
      hasRejectedFiles,
      allFilesApproved,
      currentStatus,
      missingFields,
      missingDocuments,
    };
  }
}
