import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { LocalAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/auth.model';

@Controller('superadmin')
@UseGuards(LocalAuthGuard)
@Roles(Role.SUPERADMIN)
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Post('create-admin')
  async createAdmin(
    @Body()
    adminData: {
      name: string;
      email: string;
      password: string;
      role: string;
    },
  ) {
    return await this.superadminService.createAdmin(adminData);
  }

  @Delete('delete-admin/:email')
  async deleteAdmin(@Param('email') email: string) {
    return await this.superadminService.deleteAdmin(email);
  }

  @Get('admins')
  async getAllAdmins() {
    return await this.superadminService.getAllAdmins();
  }
}
