import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UpdateWorkerDto } from './updateWorker.dto';
import { UpdateEmployerDto } from './updateEmployer.dto';
import { UpdateAgencyDto } from './updateAgency.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEnum(['worker', 'employer', 'agency'])
  role?: string;

  @IsOptional()
  workerData?: UpdateWorkerDto;

  @IsOptional()
  employerData?: UpdateEmployerDto;

  @IsOptional()
  agencyData?: UpdateAgencyDto;

  @IsOptional()
  @IsString()
  profilePicture?: string; // New URL
}

