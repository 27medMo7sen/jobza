import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema()
export class Application {
  @Prop({ required: true })
  offerId: string;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true, enum: ApplicationStatus })
  status: ApplicationStatus;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
