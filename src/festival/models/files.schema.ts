import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

export type FilesDocument = FestivalFiles & Document;

@Schema({timestamps: true})
export class FestivalFiles extends Document {
    @Prop()
    fileName: string;

    @Prop()
    mimeType: string;

    @Prop()
    key: string;

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'users' })
    userId: Types.ObjectId

    @Prop()
    fileType: string;

    @Prop({ default: 1 })
    status: number;
}

export const FilesSchema = SchemaFactory.createForClass(FestivalFiles);
