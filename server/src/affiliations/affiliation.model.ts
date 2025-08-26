import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Affiliation {
  @Prop({ type: String, enum: ['agency', 'worker'], required: true })
  senderRole: string;

  @Prop({ type: Types.ObjectId, required: true })
  senderId: Types.ObjectId;

  @Prop({ type: String, enum: ['agency', 'worker'], required: true })
  receiverRole: string;

  @Prop({ type: Types.ObjectId, required: true })
  receiverId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop()
  details: string;
}

export const AffiliationSchema = SchemaFactory.createForClass(Affiliation);
