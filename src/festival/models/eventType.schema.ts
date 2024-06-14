import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type EventTypesDocument = EventTypes & Document;

@Schema({timestamps: true})
export class EventTypes extends Document {
    @Prop({ required: true })
    eventName: string;

    @Prop({ default: 1 })
    status: number;
}

export const EventTypesSchema = SchemaFactory.createForClass(EventTypes);
