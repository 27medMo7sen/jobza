import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './files.model';
import { AuthModule } from 'src/auth/auth.module';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    AuthModule,
    AwsS3Module,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
