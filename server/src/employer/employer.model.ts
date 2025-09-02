import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.model';
@Schema({ timestamps: true })
export class Employer {
  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true , unique: true})
  userName: string;

  @Prop({required: true})
  fullName:string

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  nationality: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
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

  @Prop({ required: true })
  homeType: string;

  @Prop({ required: true })
  serviceRequirements: string[];

  @Prop({ required: true })
  workingHours: string;

  @Prop({ required: true })
  preferredStartDate: Date;

  @Prop({
    type: Object,
    required: true,
  })
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export const EmployerSchema = SchemaFactory.createForClass(Employer);
