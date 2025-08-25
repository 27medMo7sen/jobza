import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  async uploadFile(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const user = req.user;
    // console.log(file);
    // console.log(user);
    return await this.filesService.uploadFile(
      user.userId,
      file,
      body.type,
      body.label,
      body.issuanceDate,
      body.expirationDate,
    );
  }

  @Post('list')
  @UseGuards(AuthGuard)
  async listUserFiles(@Req() req: any) {
    const user = req.user;
    const ret = await this.filesService.listUserFiles(user.userId);
    return ret;
  }
}
