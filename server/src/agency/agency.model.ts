import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.model';

@Schema({ timestamps: true })
export class Agency {
  @Prop()
  agencyName: string;

  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, enum: ['service', 'placement'] })
  agencyType: string;

  @Prop()
  website: string;

  @Prop()
  registrationNumber: string;

  @Prop()
  licenseNumber: string;

  @Prop()
  establishmentDate: Date;

  @Prop()
  phoneNumber: string;

  @Prop()
  streetAddress: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  postalCode: string;

  @Prop()
  businessDescription: string;

  @Prop()
  yearsInBusiness: number;

  @Prop()
  numberOfEmployees: number;
}
export const AgencySchema = SchemaFactory.createForClass(Agency);
