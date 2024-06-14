/** Collaboration module for  props, callsheet and EPK*/

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

export type IndividualInviteDocument = IndividualInvite & Document;

class InviteInfo {
    @Prop()
    name: string

    @Prop()
    email: string

    @Prop({ type: Boolean, default: false })
    accepted: boolean

    @Prop({ type: Boolean, default: false })
    rejected: boolean

    @Prop()
    app: string
}

@Schema({ timestamps: true })
export class IndividualInvite extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    appId: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'users' })
    createdBy: Types.ObjectId

    @Prop({ type: Object, default: [] })
    inviteInfo: InviteInfo;

    @Prop({ default: 1 })
    status: number;
}

export const IndividualInviteSchema = SchemaFactory.createForClass(IndividualInvite);
