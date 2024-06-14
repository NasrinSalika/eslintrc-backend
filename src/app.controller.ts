import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';
import { EpkService } from './epk/epk.service';
import { Model, Types } from 'mongoose';
import * as jwt from 'jsonwebtoken'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private epk: EpkService,
  ) {}

  /** Health api */
  @Get()
  getHello(@Req() req: Request, @Res() res: Response) {
    return res.status(200).send({
      state: 'Healthy',
      timestamp: new Date(),
      uptime: process.uptime()
    });
  }

  @Get('login-ovniq')
  async scanQR(@Req() req: Request, @Res() res: Response) {
    let designUsers = await this.appService.findCount({ status: 1 });

    let user ={
      authKey: Date.now() + 'OS-' + designUsers,
      lastLoggedIn: Date.now()
    }
    
    let response = await this.appService.createDesignUser(user);

    let epk = await this.epk.createEpk({
      epkName: Date.now() + 'OS',
      userId: response?._id,
      width: "1080",
      height: "1080",
      projectId: Types.ObjectId("666af6247c26844dd4fe7f83"),
    });

    let token = jwt.sign({...user, _id: response?._id}, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24
    });

    let encryptedStr = Buffer.from(epk?._id?.toString()).toString('base64');

    return res.status(301).redirect('http://localhost:3000/studio/create/' + encryptedStr + '?token=' + token);
  }
}
