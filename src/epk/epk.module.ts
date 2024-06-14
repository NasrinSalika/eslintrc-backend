import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseHandler } from 'src/utils/response.handler';
import { EpkElementsModule } from './epk-elements/epk-elements.module';
import { EpkController } from './epk.controller';
import { EpkService } from './epk.service';
import { Epks, EpkSchema } from './models/epk.schema';
import { EpkTemplates, EpkTemplatesSchema } from './models/epk-template.schema';
import { InviteMembers, InviteMembersSchema } from './models/invite.schema';
import { S3FileUpload } from 'src/utils/s3';
import { Mailer } from 'src/utils/mailService';
import { EpkPagesController } from './epk-pages/epk-pages.controller';
import { EpkPagesService } from './epk-pages/epk-pages.service';
import { EpkPages, EpkPagesSchema } from './models/epk-pages.schema';

@Module({
    imports: [
        EpkElementsModule,
        MongooseModule.forFeature([
            {
                name: Epks.name,
                schema: EpkSchema
            },
            {
                name: EpkTemplates.name,
                schema: EpkTemplatesSchema
            },
            {
                name: InviteMembers.name,
                schema: InviteMembersSchema
            },
            {
                name: EpkPages.name,
                schema: EpkPagesSchema
            }
        ])
    ],
    controllers: [
        EpkController,
        EpkPagesController
    ],
    providers: [
        EpkService,
        ResponseHandler,
        S3FileUpload,
        Mailer,
        EpkPagesService
    ],
})
export class EpkModule { }
