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
export class ContactService {
  constructor(
    @InjectModel('Contact')
    private readonly contactSchema: Model<typeof ContactSchema>,
    @InjectModel('Departments')
    private readonly departmentsSchema: Model<typeof DepartmentsSchema>,
    @InjectModel('Department_Roles')
    private readonly rolesSchema: Model<typeof DepartmentRolesSchema>,
  ) { }
  async createContact(contactData: CreateContactDto) {

    // Validate that images array doesn't contain empty strings
    let images;
    if (!contactData.images[0]) {
      images = [];
    } else {
      images = contactData.images.map((image) => Types.ObjectId(image));
    }

    const departmentDocument = await this.departmentsSchema.findOne({
      name: contactData.department,
    });
    if (!departmentDocument) {
      throw new NotFoundException(
        `Department with name '${contactData.department}' not found.`,
      );
    }
    const departmentId = departmentDocument._id;

    const roleDocument = await this.rolesSchema.findOne({
      name: contactData.role,
    });
    if (!roleDocument) {
      throw new NotFoundException(
        `Role with name '${contactData.role}' not found.`,
      );
    }
    const roleId = roleDocument._id;

    const toSave = {
      name: contactData.name,
      title: contactData.title,
      department: contactData.department,
      email: contactData.email,
      phone: contactData.phone,
      address: contactData.address,
      notes: contactData.notes,
      biovideolink: contactData.biovideolink,
      departmentId: Types.ObjectId(departmentId),
      roleId: Types.ObjectId(roleId),
      images: images,
      createdBy: Types.ObjectId(contactData.createdBy),
      projectId: Types.ObjectId(contactData.projectId),
    };
    const contact = new this.contactSchema(toSave);

    return contact.save();
  }

  async getContactsForProjectIdAndUserId(projectId, userId) {
    return await this.contactSchema.find({
      projectId: Types.ObjectId(projectId),
      createdBy: Types.ObjectId(userId),
    });
  }
}
