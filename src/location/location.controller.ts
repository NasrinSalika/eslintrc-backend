import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Request, Response } from 'express';
import { ResponseHandler } from 'src/utils/response.handler';
import { AuthGuard } from 'src/Guards/auth.guard';

@Controller('locations')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private response: ResponseHandler,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  create(@Req() req: Request, @Res() res: Response) {
    try {
      this.locationService.createLocation(req.body);
      this.response.success(res, { status: 200 }, 'Contact added successfully');
    } catch (err) {
      console.log(res);
      this.response.error(err, { status: 500 }, 'Error while creating location');
    }
  }
}
