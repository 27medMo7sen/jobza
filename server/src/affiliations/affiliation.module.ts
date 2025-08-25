import { Module } from '@nestjs/common';
import { AffiliationService } from './affiliation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AffiliationSchema } from './affiliation.model';
import { AffiliationController } from './affiliation.controller';
import { AuthModule } from 'src/auth/auth.module';
import { WorkerModule } from 'src/worker/worker.module';
import { AgencyModule } from 'src/agency/agency.module';
import { MailModule } from 'src/mail/mail.module';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Affiliation', schema: AffiliationSchema }]),
        AuthModule,
        WorkerModule,
        AgencyModule,
        MailModule,
    ],
    controllers: [AffiliationController],
    providers: [AffiliationService],
    exports: [AffiliationService],
})

export class AffiliationModule {}
