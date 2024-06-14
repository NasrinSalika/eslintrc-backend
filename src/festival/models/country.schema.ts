import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CountriesDocument = Countries & Document;

@Schema({timestamps: true})
export class Countries extends Document {
    @Prop()
    id: number;

    @Prop()
    sortname: string;

    @Prop()
    name: string;

    @Prop({ default: 1 })
    phoneCode: number;
}

export const CountriesSchema = SchemaFactory.createForClass(Countries);
