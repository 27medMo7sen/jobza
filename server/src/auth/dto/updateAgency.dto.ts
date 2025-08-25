import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
  MinLength,
  IsArray,
} from 'class-validator';

export class UpdateAgencyDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  agencyName?: string;

  @IsOptional()
  @IsString()
  agencyType?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsDateString()
  establishmentDate?: Date;

  @IsOptional()
  @IsString()
  @MinLength(10)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  streetAddress?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  businessDescription?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsInBusiness?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfEmployees?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[]; // New document URLs

  @IsOptional()
  @IsString()
  logo?: string; // New logo URL

  @IsOptional()
  @IsString()
  businessLicense?: string; // New business license URL
}

