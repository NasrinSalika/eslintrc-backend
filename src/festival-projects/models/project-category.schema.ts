import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import { ProjectTypes } from "./project-type.schema";

export type ProjectCategoryDocument = FestivalProjectCategory & Document;

@Schema({timestamps: true})
export class FestivalProjectCategory extends Document {
    @Prop({ required: true })
    categoryName: string;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'ProjectTypes' }]
    })
    types: ProjectTypes[]

    @Prop({ default: 1 })
    status: number;
}

export const FestivalProjectCategorySchema = SchemaFactory.createForClass(FestivalProjectCategory);
