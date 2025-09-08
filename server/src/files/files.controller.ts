import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalAuthGuard } from 'src/auth/auth.guard';

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
    return await this.filesService.deleteFile(user.userId, user.role, fileId);
  }
}
