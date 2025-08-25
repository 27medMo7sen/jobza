import {
  IsOptional,
  IsString,
  IsDateString,
  MinLength,
  IsArray,
} from 'class-validator';

export class UpdateWorkerDto {
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
  @MinLength(2)
  nationality?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[]; // New document URLs (uploaded separately)

  @IsOptional()
  @IsString()
  profilePicture?: string; // New picture URL

  @IsOptional()
  @IsString()
  resume?: string; // New resume URL
}

