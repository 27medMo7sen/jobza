import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class JobOffer {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['hourly', 'fixed'] })
  paymentType: 'hourly' | 'fixed';

  @Prop()
  salary: number;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true, enum: ['long-term', 'short-term'] })
  type: 'long-term' | 'short-term';

  @Prop({ required: true })
  userId: string;
}

export const JobOfferSchema = SchemaFactory.createForClass(JobOffer);
