import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Agency } from './agency.model';
import { File } from '../files/files.model';
import { Auth, status } from '../auth/auth.model';
import { fileLabel } from '../files/files.model';

@Injectable()
export class AgencyProfileStatusService {
  constructor(
    @InjectModel('Agency') private readonly agencyModel: Model<Agency>,
    @InjectModel('File') private readonly fileModel: Model<File>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
  ) {}

  // Required personal information fields for agencies
  private readonly REQUIRED_PERSONAL_FIELDS = [
    'name',
    'phoneNumber',
    'country',
    'nationality',
    'gender',
  ];

  // Required document labels for agencies (currently none, but can be added later)
  private readonly REQUIRED_DOCUMENT_LABELS: string[] = [
    // Add agency required documents here when defined
  ];

  /**
   * Check if all required personal information fields are filled
   */
  private isPersonalInfoComplete(agency: Agency): boolean {
    return this.REQUIRED_PERSONAL_FIELDS.every((field) => {
      const value = agency[field];
      return value !== null && value !== undefined && value !== '';
    });
  }

  /**
   * Check if all required documents are uploaded
   */
  private async areRequiredDocumentsUploaded(
    userId: Types.ObjectId,
  ): Promise<boolean> {
    // No required documents for agencies currently
    if (this.REQUIRED_DOCUMENT_LABELS.length === 0) return true;

    const uploadedFiles = await this.fileModel.find({
      userId,
      label: { $in: this.REQUIRED_DOCUMENT_LABELS },
    });

    const uploadedLabels = uploadedFiles.map((file) => file.label);
    return this.REQUIRED_DOCUMENT_LABELS.every((label) =>
      uploadedLabels.includes(label as any),
    );
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
    if (this.REQUIRED_DOCUMENT_LABELS.length === 0) return true;

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
    let agency = await this.agencyModel.findOne({ userId });
    if (!agency) {
      // If agency profile doesn't exist, create a basic one
      agency = new this.agencyModel({ userId });
      await agency.save();
    }

    // Check if any file is rejected - if so, entire profile is rejected
    const hasRejected = await this.hasRejectedFiles(userId);
    if (hasRejected) {
      return status.REJECTED;
    }

    // Check if all required personal info is complete
    const isPersonalComplete = this.isPersonalInfoComplete(agency);
    console.log('Agency isPersonalComplete', isPersonalComplete);

    // Check if all required documents are uploaded
    const areDocumentsUploaded =
      await this.areRequiredDocumentsUploaded(userId);
    console.log('Agency areDocumentsUploaded', areDocumentsUploaded);

    // If any required field is missing, profile is not completed
    if (!isPersonalComplete || !areDocumentsUploaded) {
      console.log('Agency Status: NOT_COMPLETED - Missing requirements');
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
   * Update agency profile status in Auth collection
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
      `Agency profile status updated to ${newStatus} for user ${userId}`,
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
    const agency = await this.agencyModel.findOne({ userId });
    if (!agency) {
      throw new Error('Agency not found');
    }

    const personalInfoComplete = this.isPersonalInfoComplete(agency);
    const documentsUploaded = await this.areRequiredDocumentsUploaded(userId);
    const hasSkills = true; // Agencies don't need skills
    const hasRejectedFiles = await this.hasRejectedFiles(userId);
    const allFilesApproved = await this.areAllFilesApproved(userId);
    const currentStatus = await this.determineProfileStatus(userId);

    // Find missing fields
    const missingFields = this.REQUIRED_PERSONAL_FIELDS.filter((field) => {
      const value = agency[field];
      return !value || value === '';
    });

    // Find missing documents
    const uploadedFiles = await this.fileModel.find({
      userId,
      label: { $in: this.REQUIRED_DOCUMENT_LABELS },
    });
    const uploadedLabels = uploadedFiles.map((file) => file.label);
    const missingDocuments = this.REQUIRED_DOCUMENT_LABELS.filter(
      (label) => !uploadedLabels.includes(label as any),
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
