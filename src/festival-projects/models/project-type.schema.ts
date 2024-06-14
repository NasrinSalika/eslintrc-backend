import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProjectTypesDocument = ProjectTypes & Document;

@Schema({timestamps: true})
export class ProjectTypes extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ default: 1 })
    status: number;
}

export const ProjectTypesSchema = SchemaFactory.createForClass(ProjectTypes);
