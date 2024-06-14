import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dtos/create-contact.dto';
import { AuthGuard } from 'src/Guards/auth.guard';
import { ResponseHandler } from 'src/utils/response.handler';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private response: ResponseHandler,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  create(@Req() req: Request, @Res() res: Response) {
    try {
      this.contactService.createContact(req.body);

      this.response.success(res, { status: 200 }, 'Contact added successfully');
    } catch (err) {
      this.response.error(err, {}, 'Contact added successfully');
    }
  }

  @Get('/:projectId/:userId')
  @UseGuards()
  async getAllContacts(@Req() req: Request, @Res() res: Response, @Param() params: any) {
    try {
      console.log(params);
      const { projectId, userId } = params;
      const contacts = await this.contactService.getContactsForProjectIdAndUserId(projectId, userId);

      console.log(contacts);
      this.response.success(res, { status: 200, contacts: contacts }, 'Contacts retrieved successfully');
    } catch (err) {
      this.response.error(err, { status: 500 }, 'Erorr while retrieving contacts');
    }
  }
}
