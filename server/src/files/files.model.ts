import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/auth.model';
import { status } from 'src/auth/auth.model';
export enum fileType {
  PICTURE = 'picture',
  DOCUMENT = 'document',
}
export enum fileLabel {
  PASSPORT = 'passport',
  VISA = 'visa',
  RESIDENCE_PERMIT = 'residence_permit',
  FACE_PHOTO = 'face_photo',
  FULL_BODY_PHOTO = 'full_body_photo',
  MEDICAL_CERTIFICATE = 'medical_certificate',
  EDUCATIONAL_CERTIFICATE = 'educational_certificate',
  EXPERIENCE_LETTER = 'experience_letter',
  POLICE_CLEARANCE_CERTIFICATE = 'police_clearance_certificate',
  SIGNATURE = 'signature',
  NATIONAL_ID = 'national_id',
  PROFILE_PHOTO = 'profile_photo',
  PROOF_OF_ADDRESS = 'proof_of_address',
  EMPLOYMENT_LETTER = 'employmentLetter',
  INCOME_PROOF = 'incomeProof',
  BUSINESS_LICENSE = 'businessLicense',
  REGISTRATION_CERTIFICATE = 'registrationCertificate',
  INSURANCE_CERTIFICATE = 'insuranceCertificate',
  TAX_CERTIFICATE = 'taxCertificate',
  COMPLIANCE_DOCUMENTS = 'complianceDocuments',
  ID_DOCUMENT = 'idDocument',
  BACKGROUND_CHECK = 'backgroundCheck',
  SECURITY_CLEARANCE = 'securityClearance',
}
@Schema({ timestamps: true })
export class File {
  @Prop({ type: Types.ObjectId, ref: Auth.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  fileType: fileType;

  @Prop({ required: true })
  fileName: string;

  @Prop({
    required: true,
    enum: fileLabel,
  })
  label: fileLabel;

  @Prop({ required: true })
  s3Key: string;

  @Prop({ required: true, default: status.PENDING })
  status: status;
  @Prop({
    required: function () {
      return this.status === status.REJECTED;
    },
  })
  rejectionReason: string;

  @Prop()
  size: number;

  @Prop({ required: true })
  url: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
