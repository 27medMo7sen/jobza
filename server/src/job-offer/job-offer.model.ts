import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum WeekDay {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum JobOfferType {
  LONG_TERM = 'long-term',
  SHORT_TERM = 'short-term',
}

export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Schema({ timestamps: true })
export class JobOffer {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['hourly', 'monthly'], required: true })
  paymentType: 'hourly' | 'monthly';

  @Prop()
  salary: number;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({
    required: function () {
      return this.type === JobOfferType.LONG_TERM;
    },
  })
  numberOfMonths?: number;

  @Prop({
    type: [String],
    enum: Object.values(WeekDay),
    required: function () {
      return this.type === JobOfferType.SHORT_TERM;
    },
  })
  daysPerWeek?: WeekDay[];

  @Prop({
    required: function () {
      return this.type === JobOfferType.SHORT_TERM;
    },
  })
  numberOfWeeks?: number;

  @Prop({ required: true })
  numberOfHours: number;

  @Prop({
    required: function () {
      return this.type === JobOfferType.LONG_TERM;
    },
  })
  breakHour?: number;

  @Prop({ required: true })
  duration: string;

  @Prop({
    required: function () {
      return this.type === JobOfferType.SHORT_TERM;
    },
  })
  numberOfWorkers?: number;

  @Prop({ required: true, enum: Object.values(JobOfferType) })
  type: JobOfferType;

  @Prop({ required: true, enum: Object.values(Visibility) })
  visibility: Visibility;

  @Prop({
    enum: ['6+1', '13+2', '26+4'],
    required: function () {
      return this.type === JobOfferType.LONG_TERM;
    },
  })
  workCycle?: '6+1' | '13+2' | '26+4';

  @Prop({
    type: Types.ObjectId,
    ref: 'Employer',
  })
  employerId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Agency',
  })
  agencyId?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Worker' }] })
  workers?: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Agency' }],
  })
  agencies?: Types.ObjectId[];

  @Prop({
    enum: [
      'pending',
      'application-sent',
      'accepted',
      'rejected',
      'contract-signed',
    ],
    default: 'pending',
  })
  status: string;
}

export const JobOfferSchema = SchemaFactory.createForClass(JobOffer);

// Add schema-level validation to enforce restrictions
JobOfferSchema.pre('validate', function (next) {
  // Employer cannot create public offers
  if (this.employerId && this.visibility === Visibility.PUBLIC) {
    return next(new Error('Employers cannot create public job offers.'));
  }

  //   // Only placement agencies can create public offers
  //   if (this.agencyId && this.visibility === Visibility.PUBLIC) {
  //     // Here you’d need to check the agency type (placement vs service).
  //     // Assuming agency doc has a "type" field.
  //     // If not placement → reject
  //   }

  next();
});
