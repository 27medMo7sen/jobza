import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Employer {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ isRequired: true })
  firstName: string;

  @Prop({ isRequired: true })
  lastName: string;

  @Prop({ isRequired: true })
  phoneNumber: string;

  @Prop({ isRequired: true })
  gender: string;

  @Prop({ isRequired: true })
  nationality: string;

  @Prop({ isRequired: true })
  dateOfBirth: Date;

  @Prop({ isRequired: true })
  country: string;

  @Prop({ isRequired: true })
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

  @Prop({ isRequired: true })
  homeType: string;

  @Prop({ isRequired: true })
  serviceRequirements: string[];

  @Prop({ isRequired: true })
  workingHours: string;

  @Prop({ isRequired: true })
  preferredStartDate: Date;

  @Prop({
    type: Object,
    isRequired: true,
  })
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export const EmployerSchema = SchemaFactory.createForClass(Employer);
