import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.model';
@Schema({ timestamps: true })
export class Worker {
  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  userId: Types.ObjectId;

  @Prop()
  admin: string;

  @Prop()
  userName: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    required: false,
    type: {
      url: {
        type: String,
      },
      s3Key: {
        type: String,
      },
    },
  })
  profilePicture: {
    url: string;
    s3Key: string;
  };

  @Prop()
  phoneNumber: string;

  @Prop()
  nationality: string;

  @Prop()
  gender: string;

  @Prop()
  dateOfBirth: string;

  @Prop({ type: Boolean, default: false })
  isAffiliated: boolean;

  @Prop()
  heighestEducationalLevel: string;

  @Prop()
  skillSet: string[];

  @Prop()
  country: string;
}
export const WorkerSchema = SchemaFactory.createForClass(Worker);
