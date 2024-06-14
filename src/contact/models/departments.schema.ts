import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Departments extends Document {
  @Prop({ type: String })
  name: string;
}

export const DepartmentsSchema = SchemaFactory.createForClass(Departments);
