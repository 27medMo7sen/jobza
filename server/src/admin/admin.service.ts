import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.model';
import { Auth } from 'src/auth/auth.model';
import { Worker } from 'src/worker/worker.model';
import { File } from 'src/files/files.model';
import { PaginationDto } from 'src/auth/dto/pagination.dto';
import { fileLabel } from 'src/files/files.model';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    @InjectModel('Worker') private readonly workerModel: Model<Worker>,
    @InjectModel('File') private readonly fileModel: Model<File>,
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

  private async getContractsStats() { }

  // Dashboard stats
  async getDashboardStats(
    paginationDto: PaginationDto,
    role?: 'worker' | 'employer' | 'agency' | 'contract'
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
      const [workers, employers, agencies, totalUsers, contracts] = await Promise.all([
        this.getWorkerStats(),
        this.getEmployerStats(),
        this.getAgencyStats(),
        this.authModel.countDocuments({role: {$ne: 'admin'}}),
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
      .find({ userId: user._id.toString()})
      .select(
        'fileName label url s3Key size fileType status rejectionReason createdAt',
      )
      .sort({ createdAt: -1 });
    console.log('documents in getUserDocuments', documents);

    const documentsByLabel = documents.reduce((acc, doc) => {
      acc[doc.label] = doc;
      return acc;
    }, {} as Record<string, any>);

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
    document.rejectionReason = status === 'rejected' ? (rejectionReason || '') : '';
    await document.save();

    console.log('document after update', document);

    // sync worker/auth status after updating document
    const userStatus = await this.updateUserStatusBasedOnDocuments(document.userId.toString(), role);
    console.log('userStatus in updateDocumentStatus', userStatus);

    return { document, userStatus };
  }


  // update contract status
  async updateContractStatus( contractId: string, status: string, rejectionReason?: string ){ return { message: 'Contract status updated' }; }

  
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
    console.log('Required labels for', role, ':', requiredLabels);
  
    // 1. Check if all required docs are present
    const presentLabels = documents.map((doc) => doc.label);
    console.log('Required labels for', role, ':', requiredLabels);
    console.log('Present labels:', presentLabels);
    
    const hasAllRequired = requiredLabels.every((label) =>
      presentLabels.includes(label as any),
    );
    console.log('Has all required documents:', hasAllRequired);
    
    if (!hasAllRequired) return 'not_completed';
  
    // 2. All required docs are present → check statuses
    const documentStatuses = documents.map(doc => ({ label: doc.label, status: doc.status }));
    console.log('Document statuses:', documentStatuses);
    
    if (documents.some((doc) => doc.status === 'rejected')) return 'rejected';
    if (documents.every((doc) => doc.status === 'approved')) return 'approved';
  
    // 3. Otherwise, pending
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

}
