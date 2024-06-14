import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DesignUserDocument = DesignUser & Document;

@Schema()
export class DesignUser extends Document {
    @Prop()
    name: string;

    @Prop({})
    phonenumber: string

    @Prop({
        type: Date
    })
    lastLoggedIn: number;

    @Prop({
        type: Number,
        default: 1
    })
    status: number;

    @Prop({
        type: String
    })
    authKey: string;
}

export const DesignUserSchema = SchemaFactory.createForClass(DesignUser);


