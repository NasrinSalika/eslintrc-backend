import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

export type EpkPagesDocument = EpkPages & Document;

@Schema({ timestamps: true })
export class EpkPages extends Document {
    @Prop()
    name: string

    @Prop({ type: String })
    objects: string;

    @Prop({type: String })
    preview: string

    @Prop({type: String })
    previewImg: string

    @Prop({ type: Types.ObjectId, ref: 'users' })
    userId: Types.ObjectId

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'epks' })
    epkId: Types.ObjectId

    @Prop({ default: 1 })
    status: number;
}

export const EpkPagesSchema = SchemaFactory.createForClass(EpkPages);
