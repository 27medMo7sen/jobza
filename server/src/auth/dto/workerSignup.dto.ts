import {
  IsDate,
  IsDateString,
  IsEmail,
  IsArray,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
export class WorkerSignupDto {
  @IsString()
  @MinLength(3)
  @IsEmail()
  @Matches(/^[\w.+\-]+@gmail\.com$/, {
    message: 'Email must be a valid Gmail address',
  })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsString()
  @MinLength(3)
  name: string;

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

  @IsString()
  @MinLength(2)
  heighestEducationalLevel: string;

  @IsArray()
  @IsString({ each: true })
  skillSet: string[];

  @IsString()
  country: string;
}
