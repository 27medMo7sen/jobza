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

  @Prop()
  gender: string;

  @Prop()
  department: string;

  @Prop()
  permissions: string[];
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
