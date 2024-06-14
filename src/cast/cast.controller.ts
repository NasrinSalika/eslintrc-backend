import { Controller, Patch, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Body, Post } from '@nestjs/common';
import { ResponseHandler } from 'src/utils/response.handler';
import { CastService } from './cast.service';
import { Request, Response} from 'express';

@Controller('cast')
export class CastController {
  constructor(@InjectModel('casts') private readonly castModel: Model<any>, private response: ResponseHandler, private castService: CastService) {}

  @Post('/create')
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      this.castService.createCast(req.body);
      this.response.success(res, { status: 200 }, 'Successfully created cast');
    } catch (err) {
      this.response.error(err, 500, 'Error while creating cast');
    }
  }

  @Patch('/updateCharacter')
  async update(@Req() req: Request, @Res() res: Response) {
    try {
      this.castService.updateCharacter(
        req.body['castId'],
        req.body['newCharacter'],
      );
      this.response.success(res, { status: 200 }, 'Successfully updated character');
    } catch (err) {
      this.response.error(err, 500, 'Error while updating character');
    }
  }
}
