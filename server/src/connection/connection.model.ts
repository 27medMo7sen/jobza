import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.model';
@Schema({ timestamps: true })
export class Connection {
  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  targetUserId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;
}
export const ConnectionSchema = SchemaFactory.createForClass(Connection);
