import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseHandler } from 'src/utils/response.handler';
import { CallsheetController } from './callsheet.controller';
import { CallsheetService } from './callsheet.service';
import { Callsheet, CallsheetSchema } from './models/callsheet.schema';
import { CallsheetdayController } from './callsheetday/callsheetday.controller';
import { CallsheetdayService } from './callsheetday/callsheetday.service';
import { CallsheetDay, CallsheetDaySchema } from './models/callsheet_day.schema';
import { CallsheetDayInfo, CallsheetDayInfoSchema } from './models/callsheet_day_info.schema';
import { S3FileUpload } from 'src/utils/s3';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Callsheet.name,
        schema: CallsheetSchema
      },
      {
        name: CallsheetDay.name,
        schema: CallsheetDaySchema
      },
      {
        name: CallsheetDayInfo.name,
        schema: CallsheetDayInfoSchema
      }
    ])
  ],
  controllers: [CallsheetController, CallsheetdayController],
  providers: [
    CallsheetService,
    ResponseHandler,
    CallsheetdayService,
    S3FileUpload
  ]
})
export class CallsheetModule { }
