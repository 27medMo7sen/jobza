import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export enum Role {
  WORKER = 'worker',
  EMPLOYER = 'employer',
  AGENCY = 'agency',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}
export enum status {
  NOT_COMPLETED = 'not completed',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, enum: ['local', 'google'] })
  method: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  userName: string;
  @Prop({
    required: function () {
      return this.method === 'local';
    },
  })
  password: string;
  @Prop()
  token: string;
  @Prop({ type: String, default: null })
  code: string;
  @Prop({
    type: String,
    enum: Role,
    default: 'worker',
  })
  role: string;

  @Prop({ default: status.NOT_COMPLETED })
  status: status;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    required: function () {
      return this.role === Role.WORKER;
    },
    type: Types.ObjectId,
    ref: 'Worker',
  })
  worker: Types.ObjectId;

  @Prop({
    required: function () {
      return this.role === Role.EMPLOYER;
    },
    type: Types.ObjectId,
    ref: 'Employer',
  })
  employer: Types.ObjectId;

  @Prop({
    required: function () {
      return this.role === Role.AGENCY;
    },
    type: Types.ObjectId,
    ref: 'Agency',
  })
  agency: Types.ObjectId;

  @Prop({
    required: function () {
      return this.role === Role.ADMIN;
    },
    type: Types.ObjectId,
    ref: 'Admin',
  })
  admin: Types.ObjectId;
}
export const AuthSchema = SchemaFactory.createForClass(Auth);
