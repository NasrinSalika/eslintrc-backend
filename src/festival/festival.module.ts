import { Module } from '@nestjs/common';
import { FestivalController } from './festival.controller';
import { FestivalService } from './festival.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Festivals, FestivalsSchema } from './models/festival.schema';
import { FestivalFiles, FilesSchema } from './models/files.schema';
import { Category, CategorySchema } from './models/category.schema';
import { FestivalFocus, FestivalFocusSchema } from './models/festivalfocus.schema';
import { EventTypes, EventTypesSchema } from './models/eventType.schema';
import { CountriesSchema, Countries } from './models/country.schema';
import { CurrenciesSchema, Currencies } from './models/currency.schema';
import { EventTypeService } from './event-type.service';
import { CategoryService } from './category.service';
import { FestivalFocusService } from './festival-focus.service';
import { ResponseHandler } from 'src/utils/response.handler';
import { S3FileUpload } from 'src/utils/s3';
 
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Festivals.name,
        schema: FestivalsSchema 
      }, 
      {
        name: FestivalFiles.name,
        schema: FilesSchema
      },
      {
        name: Category.name,
        schema: CategorySchema
      },
      {
        name: FestivalFocus.name,
        schema: FestivalFocusSchema
      },
      {
        name: EventTypes.name,
        schema: EventTypesSchema
      },
      {
        name: Countries.name,
        schema: CountriesSchema
      },
      {
        name: Currencies.name,
        schema: CurrenciesSchema
      }
    ])
  ],
  controllers: [
    FestivalController
  ],
  providers: [
    FestivalService,
    EventTypeService,
    CategoryService,
    FestivalFocusService,
    ResponseHandler,
    S3FileUpload
  ]
})
export class FestivalModule {}
