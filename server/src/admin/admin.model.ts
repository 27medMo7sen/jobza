import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.model';

@Schema({ timestamps: true })
export class Admin {
  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  userId: Types.ObjectId;

  @Prop()
  userName: string;

  @Prop({ required: true })
  email: string;

  // Personal Information
  @Prop({ required: true })
  name: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  nationality: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  country: string;

  @Prop()
  gender: string;

  @Prop({
    type: {
      url: String,
      s3Key: String,
    },
  })
  profilePicture: {
    url: string;
    s3Key: string;
  };
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
