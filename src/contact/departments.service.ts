import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dtos/create-contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './models/contact.schema';
import { Model } from 'mongoose';
import { DepartmentsSchema } from './models/departments.schema';
import { DepartmentRolesSchema } from './models/department_Roles';
import { Types } from 'mongoose';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectModel('Departments')
        private readonly departmentsSchema: Model<typeof DepartmentsSchema>,
    ) { }

    async findAll() {
        return await this.departmentsSchema.find();
    }
}
