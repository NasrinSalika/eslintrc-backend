import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

export type CallsheetDayDocument = CallsheetDay & Document;

@Schema({ timestamps: true })
export class CallsheetDay extends Document {
    @Prop({ type: Date })
    callSheetDay: number

    @Prop({type: String})
    name: string

    @Prop({ type: Boolean, default: false})
    callSheetCreated: boolean

    @Prop({ type: Boolean, default: false })
    dayOff: boolean

    @Prop({ type: Types.ObjectId, ref: 'callsheets' })
    callSheetId: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'users' })
    userId: Types.ObjectId

    @Prop({ type: Number, default: 1 })
    status: number;
}

export const CallsheetDaySchema = SchemaFactory.createForClass(CallsheetDay);