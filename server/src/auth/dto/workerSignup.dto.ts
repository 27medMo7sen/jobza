import {
  IsDate,
  IsDateString,
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';
export class WorkerSignupDto {
  @IsString()
  @MinLength(3)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @MinLength(3)
  lastName: string;

  @IsString()
  role: string;

  @IsString()
  @MinLength(10)
  phoneNumber: string;

  @IsString()
  @MinLength(2)
  nationality: string;

  @IsString()
  gender: string;

  @IsDateString()
  @MinLength(10)
  dateOfBirth: Date;
}
