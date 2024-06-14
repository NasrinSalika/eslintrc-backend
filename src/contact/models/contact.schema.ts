import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  department: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: String })
  biovideolink: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'departments' })
  departmentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'department_roles' })
  roleId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'medias' }] })
  images: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'userprojects' })
  projectId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  status: number;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
