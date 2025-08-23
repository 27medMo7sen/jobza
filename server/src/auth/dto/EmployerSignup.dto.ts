import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
  Min,
  Max,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

class HouseholdCompositionDto {
  @IsNumber()
  @Min(0)
  adults: number;

  @IsNumber()
  @Min(0)
  children: number;

  @IsNumber()
  @Min(0)
  infants: number;

  @IsNumber()
  @Min(0)
  elderly: number;
}

class BudgetRangeDto {
  @IsNumber()
  min: number;

  @IsNumber()
  max: number;

  @IsString()
  currency: string;
}

export class EmployerSignupDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  role: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  householdSize: number;

  @IsObject()
  @ValidateNested()
  @Type(() => HouseholdCompositionDto)
  householdComposition: HouseholdCompositionDto;

  @IsString()
  @IsNotEmpty()
  homeType: string;

  @IsArray()
  @IsString({ each: true })
  serviceRequirements: string[];

  @IsString()
  @IsNotEmpty()
  workingHours: string;

  @IsDateString()
  preferredStartDate: Date;

  @IsObject()
  @ValidateNested()
  @Type(() => BudgetRangeDto)
  budgetRange: BudgetRangeDto;
}
