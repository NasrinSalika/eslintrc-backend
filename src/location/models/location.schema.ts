import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Locations extends Document {
  @Prop({ type: String, required: false })
  pageNumber: string;

  @Prop({ type: String, required: false })
  locationName: string;

  @Prop({ type: String, required: false })
  sceneName: string;

  @Prop({ type: String, required: false })
  sceneHeading: string;

  @Prop({ type: String, required: false })
  sceneNumber: string;

  @Prop({ type: String, required: false })
  longitude: string;

  @Prop({ type: String, required: false })
  latitude: string;

  @Prop({ type: String, required: false })
  address: string;

  @Prop({ type: String, required: false })
  notes: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'medias' }],
    required: false,
  })
  images: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'userprojects' })
  projectId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Number, default: 0 })
  __v: number;
}

export const LocationsSchema = SchemaFactory.createForClass(Locations);
