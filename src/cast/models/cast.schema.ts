import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Cast extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  role: string;

  @Prop({ type: String })
  character: string;

  @Prop({ type: String })
  height: string;

  @Prop({ type: String })
  weight: string;

  @Prop({ type: String })
  age: string;

  @Prop({ type: String })
  videolink: string;

  @Prop({ type: String })
  build: string;

  @Prop({ type: String })
  ethnicity: string;

  @Prop({ type: String })
  hairColor: string;

  @Prop({ type: String })
  eyecolor: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  website: string;

  @Prop({ type: String })
  imdb: string;

  @Prop({ type: Boolean, default: false })
  union: boolean;

  @Prop({ type: String })
  agentsName: string;

  @Prop({ type: String })
  agentsNumber: string;

  @Prop({ type: String })
  shortList: string;

  @Prop({ type: Boolean, default: false })
  offerSent: boolean;

  @Prop({ type: Number, default: 1 })
  castingStatus: number; // 1-pending, 2-accepted, 3-declined

  @Prop({ type: String })
  notes: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'medias' }] })
  images: MongooseSchema.Types.ObjectId[];

  @Prop({ type: String })
  emailToken: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'userprojects' })
  projectId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  status: number;
}

export const CastSchema = SchemaFactory.createForClass(Cast);
