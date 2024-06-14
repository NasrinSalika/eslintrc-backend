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
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
    constructor(
        private readonly departmentsService: DepartmentsService,
        private response: ResponseHandler,
    ) { }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(@Res() res: Response) {
        this.response.success(
            res,
            await this.departmentsService.findAll(),
            'Succesfully retrieved all departments',
        );
    }
}
