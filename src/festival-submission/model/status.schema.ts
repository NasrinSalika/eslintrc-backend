import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type StatusTypesDocument = StatusTypes & Document;

@Schema({timestamps: true})
export class StatusTypes extends Document {
    @Prop({ required: true })
    statusName: string;

    @Prop()
    type: string;

    @Prop()
    color: string;

    @Prop({ default: 1 })
    status: number;
}

export const StatusTypesSchema = SchemaFactory.createForClass(StatusTypes);
