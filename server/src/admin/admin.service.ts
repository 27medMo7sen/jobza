import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.model';
import { Auth, status } from 'src/auth/auth.model';
import { File } from 'src/files/files.model';
import { PaginationDto } from 'src/auth/dto/pagination.dto';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { WorkerProfileStatusService } from 'src/worker/worker-profile-status.service';
import { EmployerProfileStatusService } from 'src/employer/employer-profile-status.service';
import { AgencyProfileStatusService } from 'src/agency/agency-profile-status.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    @InjectModel('File') private readonly fileModel: Model<File>,
    private readonly workerProfileStatusService: WorkerProfileStatusService,
    private readonly employerProfileStatusService: EmployerProfileStatusService,
    private readonly agencyProfileStatusService: AgencyProfileStatusService,
  ) {}

  private async getWorkerStats() {
    const [total, approved, rejected] = await Promise.all([
      this.authModel.countDocuments({ role: 'worker' }),
      this.authModel.countDocuments({ role: 'worker', status: 'approved' }),
      this.authModel.countDocuments({ role: 'worker', status: 'rejected' }),
    ]);

    return { total, approved, rejected };
  }

  private async getEmployerStats() {
    const [total, approved, rejected] = await Promise.all([
      this.authModel.countDocuments({ role: 'employer' }),
      this.authModel.countDocuments({ role: 'employer', status: 'approved' }),
      this.authModel.countDocuments({ role: 'employer', status: 'rejected' }),
    ]);

    return { total, approved, rejected };
  }

  private async getAgencyStats() {
    const [total, approved, rejected] = await Promise.all([
      this.authModel.countDocuments({ role: 'agency' }),
      this.authModel.countDocuments({ role: 'agency', status: 'approved' }),
      this.authModel.countDocuments({ role: 'agency', status: 'rejected' }),
    ]);

    return { total, approved, rejected };
  }

  private async getContractsStats() {}

  // Dashboard stats
  async getDashboardStats(
    paginationDto: PaginationDto,
    role?: 'worker' | 'employer' | 'agency' | 'contract',
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    // Pending list (filtered by role if provided)
    const roleFilter = role ? { role } : {};
    // in case of pending contracts
    // add logic
    const pendingList = await this.authModel
      .find({ status: 'pending', ...roleFilter })
      .select('userName email status role worker employer agency')
      .skip(skip)
      .limit(limit)
      .exec();

    //add contract alogic t be added to the add
    const totalPending = await this.authModel.countDocuments({
      status: 'pending',
      ...roleFilter,
    });

    // Decide what to fetch
    let counts: any = {};
    if (!role) {
      // Fetch everything (summary dashboard)
      const [workers, employers, agencies, totalUsers, contracts] =
        await Promise.all([
          this.getWorkerStats(),
          this.getEmployerStats(),
          this.getAgencyStats(),
          this.authModel.countDocuments({ role: { $ne: 'admin' } }),
          this.getContractsStats(),
        ]);

      counts = { users: totalUsers, workers, employers, agencies, contracts };
    } else {
      // Fetch only selected role
      const statsMap = {
        worker: () => this.getWorkerStats(),
        employer: () => this.getEmployerStats(),
        agency: () => this.getAgencyStats(),
        // contract: () => this.getContractStats(), // for future
      };

      const roleStats = await statsMap[role]();
      counts = { [role + 's']: roleStats }; // e.g., { workers: { total, approved, rejected } }
    }

    return {
      role: role || 'all',
      pending: pendingList,
      totalPending,
      page,
      limit,
      totalPages: Math.ceil(totalPending / limit),
      hasNextPage: page * limit < totalPending,
      counts,
    };
  }

  // user documents
  async getUserDocuments(userId: string) {
    const user = await this.authModel.findById(userId);
    console.log('user in getUserDocuments', user);
    if (!user) throw new Error('User not found');

    const documents = await this.fileModel
      .find({ userId: user._id.toString() })
      .select(
        'fileName label url s3Key size fileType status rejectionReason createdAt',
      )
      .sort({ createdAt: -1 });
    console.log('documents in getUserDocuments', documents);

    const documentsByLabel = documents.reduce(
      (acc, doc) => {
        acc[doc.label] = doc;
        return acc;
      },
      {} as Record<string, any>,
    );

    return {
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
      documents: documentsByLabel,
      // allDocuments: documents,
    };
  }

  // document status update
  async updateDocumentStatus(
    documentId: string,
    role: string,
    status: string,
    rejectionReason?: string,
  ) {
    const document = await this.fileModel.findById(documentId);
    console.log('document', document);
    if (!document) throw new NotFoundException('Document not found');

    document.status = status as any;
    document.rejectionReason =
      status === 'rejected' ? rejectionReason || '' : '';
    await document.save();

    console.log('document after update', document);

    // sync worker/auth status after updating document
    const userStatus = await this.updateUserStatusBasedOnDocuments(
      document.userId.toString(),
      role,
    );
    console.log('userStatus in updateDocumentStatus', userStatus);

    return { document, userStatus };
  }

  // update contract status
  async updateContractStatus(
    contractId: string,
    status: string,
    rejectionReason?: string,
  ) {
    return { message: 'Contract status updated' };
  }

  /**
   * Get the appropriate profile status service based on role
   */
  private getProfileStatusService(role: string) {
    switch (role) {
      case 'worker':
        return this.workerProfileStatusService;
      case 'employer':
        return this.employerProfileStatusService;
      case 'agency':
        return this.agencyProfileStatusService;
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  /**
   * Determine the current profile status based on all criteria
   */
  async determineProfileStatus(
    userId: Types.ObjectId,
    role: string,
  ): Promise<status> {
    const profileService = this.getProfileStatusService(role);
    return await profileService.determineProfileStatus(userId);
  }

  /**
   * Update user profile status in Auth collection
   */
  async updateProfileStatus(
    userId: Types.ObjectId,
    newStatus: status,
    role: string,
  ): Promise<void> {
    const profileService = this.getProfileStatusService(role);
    await profileService.updateProfileStatus(userId, newStatus);
  }

  /**
   * Auto-update profile status based on current state
   */
  async autoUpdateProfileStatus(
    userId: Types.ObjectId,
    role: string,
  ): Promise<status> {
    const profileService = this.getProfileStatusService(role);
    return await profileService.autoUpdateProfileStatus(userId);
  }

  /**
   * Handle file upload - re-evaluate status based on current state
   */
  async handleFileUpload(userId: Types.ObjectId, role: string): Promise<void> {
    const profileService = this.getProfileStatusService(role);
    await profileService.handleFileUpload(userId);
  }

  /**
   * Handle file rejection - set status to rejected
   */
  async handleFileRejection(
    userId: Types.ObjectId,
    role: string,
  ): Promise<void> {
    const profileService = this.getProfileStatusService(role);
    await profileService.handleFileRejection(userId);
  }

  /**
   * Handle file approval - check if all files are approved and update accordingly
   */
  async handleFileApproval(
    userId: Types.ObjectId,
    role: string,
  ): Promise<void> {
    const profileService = this.getProfileStatusService(role);
    await profileService.handleFileApproval(userId);
  }

  /**
   * Handle profile information update - re-evaluate status
   */
  async handleProfileUpdate(
    userId: Types.ObjectId,
    role: string,
  ): Promise<void> {
    const profileService = this.getProfileStatusService(role);
    await profileService.handleProfileUpdate(userId);
  }

  /**
   * Handle skills update - re-evaluate status (for workers)
   */
  async handleSkillsUpdate(
    userId: Types.ObjectId,
    role: string,
  ): Promise<void> {
    const profileService = this.getProfileStatusService(role);
    if (role === 'worker') {
      await (profileService as WorkerProfileStatusService).handleSkillsUpdate(
        userId,
      );
    }
  }

  /**
   * Get profile completeness details for debugging/admin purposes
   */
  async getProfileCompletenessDetails(
    userId: Types.ObjectId,
    role: string,
  ): Promise<{
    personalInfoComplete: boolean;
    documentsUploaded: boolean;
    hasSkills: boolean;
    hasRejectedFiles: boolean;
    allFilesApproved: boolean;
    currentStatus: status;
    missingFields: string[];
    missingDocuments: string[];
  }> {
    const profileService = this.getProfileStatusService(role);
    return await profileService.getProfileCompletenessDetails(userId);
  }

  // Legacy method for backward compatibility
  async updateUserStatusBasedOnDocuments(userId: string, role: string) {
    const newStatus = await this.autoUpdateProfileStatus(
      new Types.ObjectId(userId),
      role,
    );
    return {
      userId: new Types.ObjectId(userId),
      status: newStatus,
      updated: true,
    };
  }
}
