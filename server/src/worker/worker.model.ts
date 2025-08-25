import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.model';
@Schema({ timestamps: true })
export class Worker {
  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  userId: Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  nationality: string;

  @Prop()
  gender: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  isAffiliated: boolean;
}
export const WorkerSchema = SchemaFactory.createForClass(Worker);
