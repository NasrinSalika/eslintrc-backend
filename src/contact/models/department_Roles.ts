import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class DepartmentRoles extends Document {
  @Prop({ type: String })
  name: string;
}

export const DepartmentRolesSchema =
  SchemaFactory.createForClass(DepartmentRoles);
