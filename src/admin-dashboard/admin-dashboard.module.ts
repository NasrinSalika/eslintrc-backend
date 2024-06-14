import { Module } from '@nestjs/common';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { ResponseHandler } from 'src/utils/response.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { Festivals, FestivalsSchema } from 'src/festival/models/festival.schema';
import { FestivalService } from 'src/festival/festival.service';
import { FestivalFiles, FilesSchema } from 'src/festival/models/files.schema';
import { Mailer } from 'src/utils/mailService';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Festivals.name,
        schema: FestivalsSchema 
      }, 
      {
        name: FestivalFiles.name,
        schema: FilesSchema
      }
    ])
  ],
  controllers: [
    AdminDashboardController
  ],
  providers: [
    AdminDashboardService,
    ResponseHandler,
    FestivalService,
    Mailer
  ]
})
export class AdminDashboardModule {}
