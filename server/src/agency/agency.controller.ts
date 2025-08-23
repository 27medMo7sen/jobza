import { Controller } from '@nestjs/common';
import { AgencyService } from './agency.service';

@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}
}
