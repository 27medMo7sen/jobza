import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { Types } from 'mongoose';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(LocalAuthGuard)
  async uploadFile(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const user = req.user;
    return await this.filesService.uploadFile(
      user.userId,
      user.role,
      file,
      body.type,
      body.label,
    );
  }

  @Get('list')
  @UseGuards(LocalAuthGuard)
  async listUserFiles(@Req() req: any) {
    console.log('listUserFiles');
    const user = req.user;
    const ret = await this.filesService.listUserFiles(user.userId);
    return ret;
  }

  @Delete('/:fileId')
  @UseGuards(LocalAuthGuard)
  async deleteFile(@Req() req: any, @Param('fileId') fileId: string) {
    const user = req.user;
    return await this.filesService.deleteFile(
      user.userId,
      new Types.ObjectId(fileId),
    );
  }

  @Put('/:fileId/status')
  @UseGuards(LocalAuthGuard)
  async updateFileStatus(
    @Req() req: any,
    @Param('fileId') fileId: string,
    @Body() body: { status: string; rejectionReason?: string },
  ) {
    // Only admins should be able to update file status
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      throw new Error('Unauthorized: Admin access required');
    }

    return await this.filesService.updateFileStatus(
      new Types.ObjectId(fileId),
      body.status,
      body.rejectionReason,
    );
  }

  @Get('/profile-completeness/:userId')
  @UseGuards(LocalAuthGuard)
  async getProfileCompleteness(
    @Req() req: any,
    @Param('userId') userId: string,
    @Query('role') role: string,
  ) {
    // Only admins should be able to view profile completeness details
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      throw new Error('Unauthorized: Admin access required');
    }

    return await this.filesService.getProfileCompletenessDetails(
      new Types.ObjectId(userId),
      role || 'worker',
    );
  }
}
