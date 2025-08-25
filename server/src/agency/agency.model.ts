import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Agency {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop()
  agencyName: string;

  @Prop()
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
  fullName: string;

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
