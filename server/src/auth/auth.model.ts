import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, enum: ['local', 'google'] })
  method: string;
  @Prop({ required: true, default: 'local' })
  userName: string;
  @Prop({ required: function() {
    return this.method === 'local';
  } })
  password: string;
  @Prop()
  token: string;
  @Prop({ type: String, default: null })
  code: string;
  @Prop({
    type: String,
    enum: ['worker', 'employer', 'agency', 'admin', 'superadmin'],
    default: 'worker',
  })
  role: string;

  @Prop({ default: false })
  approved: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    required: function () {
      return this.role === 'worker';
    },
    type: Types.ObjectId,
    ref: 'Worker',
  })
  worker: Types.ObjectId;

  @Prop({
    required: function () {
      return this.role === 'employer';
    },
    type: Types.ObjectId,
    ref: 'Employer',
  })
  employer: Types.ObjectId;

  @Prop({
    required: function () {
      return this.role === 'agency';
    },
    type: Types.ObjectId,
    ref: 'Agency',
  })
  agency: Types.ObjectId;
}
export const AuthSchema = SchemaFactory.createForClass(Auth);
