import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

export type CallsheetDocument = Callsheet & Document;

@Schema({ timestamps: true })
export class Callsheet extends Document {
    @Prop({ type: String })
    name: string

    @Prop({ type: Number })
    startDate: number

    @Prop({ type: Number })
    endDate: number

    @Prop({ type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] })
    workingDays: [string]

    @Prop({ type: Types.ObjectId, ref: 'userprojects' })
    projectId: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'users' })
    userId: Types.ObjectId

    @Prop({ default: 1 })
    status: number;
}

export const CallsheetSchema = SchemaFactory.createForClass(Callsheet);
