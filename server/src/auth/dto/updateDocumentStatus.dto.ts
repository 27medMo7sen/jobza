import { IsString, IsOptional, IsIn } from 'class-validator';


export class UpdateDocumentStatusDto {
    @IsIn(['pending', 'approved', 'rejected'])
    status: string;
  
    @IsOptional()
    @IsString()
    rejectionReason?: string;
  }
  