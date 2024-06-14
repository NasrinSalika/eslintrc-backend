import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { ResponseHandler } from 'src/utils/response.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationsSchema } from './models/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Locations', schema: LocationsSchema }]),
  ],
  controllers: [LocationController],
  providers: [LocationService, ResponseHandler],
})
export class LocationModule {}
