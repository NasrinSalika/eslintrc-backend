import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import { EventTypes } from "./eventType.schema";

export type CategoryDocument = Category & Document;

@Schema({timestamps: true})
export class Category extends Document {
    @Prop({ required: true })
    categoryName: string;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'EventTypes' }]
    })
    events: EventTypes[]

    @Prop({ default: 1 })
    status: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
