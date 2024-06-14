import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dtos/create-contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './models/contact.schema';
import { Model } from 'mongoose';
import { DepartmentRolesSchema } from './models/department_Roles';
import { Types } from 'mongoose';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel('Department_Roles')
        private readonly departmentRolesSchema: Model<typeof DepartmentRolesSchema>,
    ) { }

    async findAll() {
        return await this.departmentRolesSchema.find();
    }
}
