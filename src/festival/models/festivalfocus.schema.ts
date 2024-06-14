import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FestivalFocusDocument = FestivalFocus & Document;

@Schema({timestamps: true})
export class FestivalFocus extends Document {
    @Prop({ required: true })
    focusName: string;

    @Prop({ default: 1 })
    status: number;
}

export const FestivalFocusSchema = SchemaFactory.createForClass(FestivalFocus);
