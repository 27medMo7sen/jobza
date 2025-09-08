import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.model';
@Schema({ timestamps: true })
export class Employer {
  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({
    required: true,
    type: {
      url: {
        type: String,
        required: true,
      },
      s3Key: {
        type: String,
        required: true,
      },
    },
  })
  profilePicture: {
    url: string;
    s3Key: string;
  };

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  nationality: string;

  @Prop({ required: false })
  dateOfBirth: Date;

  @Prop({ required: false })
  country: string;

  @Prop({ required: false })
  householdSize: number;

  @Prop({
    type: Object,
  })
  householdComposition: {
    adults: number;
    children: number;
    infants: number;
    elders: number;
  };

  @Prop({ required: false })
  homeType: string;

  @Prop({ required: false })
  serviceRequirements: string[];

  @Prop({ required: false })
  workingHours: string;

  @Prop({ required: false })
  preferredStartDate: Date;

  @Prop({
    type: Object,
    required: false,
  })
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export const EmployerSchema = SchemaFactory.createForClass(Employer);
