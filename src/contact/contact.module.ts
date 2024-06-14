import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from './models/contact.schema';
import { ResponseHandler } from 'src/utils/response.handler';
import { DepartmentsSchema } from './models/departments.schema';
import { DepartmentRolesSchema } from './models/department_Roles';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Contact', schema: ContactSchema },
      { name: 'Departments', schema: DepartmentsSchema },
      { name: 'Department_Roles', schema: DepartmentRolesSchema },
    ]),
  ],
  controllers: [ContactController, DepartmentsController, RolesController],
  providers: [
    ContactService,
    ResponseHandler,
    DepartmentsService,
    RolesService,
  ],
})
export class ContactModule { }
