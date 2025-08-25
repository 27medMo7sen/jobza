import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Worker {
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
