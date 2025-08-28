import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.model';
@Schema({ timestamps: true })
export class File {
  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  fileType: 'picture' | 'document';

  @Prop({ required: true })
  fileName: string;

  @Prop({
    required: true,
    enum: [
      'passport',
      'residence_permit',
      'face_photo',
      'full_body_photo',
      'medical_certificate',
      'educational_certificate',
      'experience_letter',
      'police_clearance_certificate',
      'signature',
    ],
  })
  label: string;

  @Prop()
  issuanceDate: Date;

  @Prop()
  expirationDate: Date;

  @Prop({ required: true })
  s3Key: string;

  @Prop({ required: true })
  url: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
