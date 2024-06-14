import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mailer } from 'src/utils/mailService';
import { ResponseHandler } from 'src/utils/response.handler';
import { ContractSigners, SignersSchema } from '../models/contract-signer.schema';
import { ContractSigns, ContractSignSchema } from '../models/contract-signs.schema';
import { Contracts, ContractSchema } from '../models/contract.schema';
import { SignersController } from './signers.controller';
import { SignersService } from './signers.service';
import { ContractService } from '../contract.service';
import { ContractForm, ContractFormSchema } from '../models/contract-form.schema';
import { Medias, MediaSchema } from '../models/media.schema';
import { ContractPdf, ContractPdfSchema } from '../models/contract-pdf-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ContractSigners.name,
        schema: SignersSchema
      },
      {
        name: Contracts.name,
        schema: ContractSchema 
      },
      {
        name: ContractSigns.name,
        schema: ContractSignSchema
      },
      {
        name: ContractForm.name,
        schema: ContractFormSchema
      },
      {
        name: Medias.name,
        schema: MediaSchema
      },
      {
        name: ContractPdf.name,
        schema: ContractPdfSchema
      },
    ])
  ],
  controllers: [
    SignersController
  ],
  providers: [
    SignersService,
    ResponseHandler,
    Mailer,
    ContractService
  ]
})
export class SignersModule { }
