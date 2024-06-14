import { Module } from '@nestjs/common';
import { CastService } from './cast.service';
import { CastController } from './cast.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CastSchema } from './models/cast.schema';
import { ResponseHandler } from 'src/utils/response.handler';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'casts', schema: CastSchema }])],
  controllers: [CastController],
  providers: [CastService, ResponseHandler],
})
export class CastModule {}
