import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { WorkerService } from 'src/worker/worker.service';
import { UpdateDocumentStatusDto } from 'src/auth/dto/updateDocumentStatus.dto';
import { PaginationDto } from 'src/auth/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/auth.model';
import { Roles } from 'src/auth/roles.decorator';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';


@Controller('admin')
@UseGuards(LocalAuthGuard)
@Roles('admin', 'superAdmin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}


  // Dashboard endpoint - get all workers with pending status
  @Get('dashboard')
   async getDashboard(
    @Query() paginationDto: PaginationDto,
    @Query('role') role?: 'worker' | 'employer' | 'agency' | 'contract',
  ) {
    return this.adminService.getDashboardStats(paginationDto, role);
  }


  // Get specific user by ID
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  // Get all documents for a specific user
  @Get('users/:id/documents')
  async getUserDocuments(@Param('id') id: string) {
    return this.adminService.getUserDocuments(id);
  }

  // Update individual document status
  @Patch('documents/:id')
  async updateDocumentStatus(
    @Param('id') id: string,
    @Body() body: UpdateDocumentStatusDto,
    @Query('role') role?: 'worker' | 'employer' | 'agency'
  ) {
    return this.adminService.updateDocumentStatus(
      id,
      role || 'worker',
      body.status,
      body.rejectionReason || ''
    );
  }
  // Update individual document status
  @Patch('contracts/:id')
  async updateContractStatus(
    @Param('id') id: string,
    @Body() body: UpdateDocumentStatusDto,
  ) {
    return this.adminService.updateContractStatus(
      id,
      body.status,
      body.rejectionReason || ''
    );
  }
}
