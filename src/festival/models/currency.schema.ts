import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CurrencyDocument = Currencies & Document;

@Schema({timestamps: true})
export class Currencies extends Document {
    @Prop()
    id: number;

    @Prop()
    symbol: string;

    @Prop()
    name: string;

    @Prop()
    symbol_native: string;

    @Prop()
    code: string;

}

export const CurrenciesSchema = SchemaFactory.createForClass(Currencies);
