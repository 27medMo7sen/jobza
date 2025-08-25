import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateHouseholdCompositionDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  adults?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  children?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  infants?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  elderly?: number;
}

class UpdateBudgetRangeDto {
  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  max?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class UpdateEmployerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  householdSize?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateHouseholdCompositionDto)
  householdComposition?: UpdateHouseholdCompositionDto;

  @IsOptional()
  @IsString()
  homeType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceRequirements?: string[];

  @IsOptional()
  @IsString()
  workingHours?: string;

  @IsOptional()
  @IsDateString()
  preferredStartDate?: Date;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateBudgetRangeDto)
  budgetRange?: UpdateBudgetRangeDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[]; // New document URLs

  @IsOptional()
  @IsString()
  profilePicture?: string; // New picture URL
}
