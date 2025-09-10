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
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  userName?: string;

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
  skillSet?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[]; // New document URLs (uploaded separately)

  @IsOptional()
  profilePicture?: string; // New picture URL

  @IsOptional()
  @IsString()
  resume?: string; // New resume URL
}
