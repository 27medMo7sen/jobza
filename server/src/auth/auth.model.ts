import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Auth {
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  token: string;
  @Prop({ type: String, default: null })
  code: string;
  @Prop({
    type: String,
    enum: ['worker', 'employer', 'agency', 'admin'],
    default: 'worker',
  })
  role: string;
  @Prop({ default: false })
  isVerified: boolean;
}
export const AuthSchema = SchemaFactory.createForClass(Auth);
