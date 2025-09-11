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

  async getAdminByUserId(
    userId: Types.ObjectId,
  ): Promise<(Admin & { _id: Types.ObjectId }) | null> {
    const admin = await this.adminModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean<Admin>()
      .exec();
    return admin as (Admin & { _id: Types.ObjectId }) | null;
  }

  async updateAdmin(
    adminId: Types.ObjectId,
    updateData: any,
  ): Promise<Admin | null> {
    const admin = (await this.adminModel
      .findOneAndUpdate({ _id: adminId }, { $set: updateData }, { new: true })
      .exec()) as Admin;

    return admin;
  }

  async getAdminProfile(adminId: string) {
    const admin = await this.adminModel
      .findById(adminId)
      .populate('userId', 'email role isVerified createdAt')
      .exec();

    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }

    return {
      message: 'Admin profile retrieved successfully',
      admin,
    };
  }

  async getPendingWorkers(paginationDto: any) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const workers = await this.authModel
      .find({
        role: 'worker',
        status: 'pending',
      })
      .populate(
        'worker',
        'name email phoneNumber country nationality gender dateOfBirth address city skillSet experience',
      )
      .select('name email userName role status createdAt')
      .skip(skip)
      .limit(limit)
      .exec();

    // Flatten the data structure
    const flattenedWorkers = workers.map((worker) => {
      const workerData = worker.worker as any;
      return {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        userName: worker.userName,
        role: worker.role,
        status: worker.status,
        createdAt: (worker as any).createdAt,
        // Flatten worker-specific data
        phoneNumber: workerData?.phoneNumber,
        country: workerData?.country,
        nationality: workerData?.nationality,
        gender: workerData?.gender,
        dateOfBirth: workerData?.dateOfBirth,
        address: workerData?.address,
        city: workerData?.city,
        skillSet: workerData?.skillSet,
        experience: workerData?.experience,
      };
    });

    const total = await this.authModel.countDocuments({
      role: 'worker',
      status: 'pending',
    });

    return {
      data: flattenedWorkers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPendingEmployers(paginationDto: any) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const employers = await this.authModel
      .find({
        role: 'employer',
        status: 'pending',
      })
      .populate(
        'employer',
        'name email phoneNumber companyName industry businessType address city country',
      )
      .select('name email userName role status createdAt')
      .skip(skip)
      .limit(limit)
      .exec();

    // Flatten the data structure
    const flattenedEmployers = employers.map((employer) => {
      const employerData = employer.employer as any;
      return {
        _id: employer._id,
        name: employer.name,
        email: employer.email,
        userName: employer.userName,
        role: employer.role,
        status: employer.status,
        createdAt: (employer as any).createdAt,
        // Flatten employer-specific data
        phoneNumber: employerData?.phoneNumber,
        companyName: employerData?.companyName,
        industry: employerData?.industry,
        businessType: employerData?.businessType,
        address: employerData?.address,
        city: employerData?.city,
        country: employerData?.country,
      };
    });

    const total = await this.authModel.countDocuments({
      role: 'employer',
      status: 'pending',
    });

    return {
      data: flattenedEmployers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPendingAgencies(paginationDto: any) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const agencies = await this.authModel
      .find({
        role: 'agency',
        status: 'pending',
      })
      .populate(
        'agency',
        'name email phoneNumber agencyName licenseNumber address city country businessType',
      )
      .select('name email userName role status createdAt')
      .skip(skip)
      .limit(limit)
      .exec();

    // Flatten the data structure
    const flattenedAgencies = agencies.map((agency) => {
      const agencyData = agency.agency as any;
      return {
        _id: agency._id,
        name: agency.name,
        email: agency.email,
        userName: agency.userName,
        role: agency.role,
        status: agency.status,
        createdAt: (agency as any).createdAt,
        // Flatten agency-specific data
        phoneNumber: agencyData?.phoneNumber,
        agencyName: agencyData?.agencyName,
        licenseNumber: agencyData?.licenseNumber,
        address: agencyData?.address,
        city: agencyData?.city,
        country: agencyData?.country,
        businessType: agencyData?.businessType,
      };
    });

    const total = await this.authModel.countDocuments({
      role: 'agency',
      status: 'pending',
    });

    return {
      data: flattenedAgencies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPendingContracts(paginationDto: any) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    // For now, return empty array as we don't have contracts implemented yet
    // This can be implemented when the contract system is ready
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    };
  }
}
