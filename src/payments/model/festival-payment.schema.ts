import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

export type PaymentDocument = Payments & Document;

@Schema({timestamps: true})
export class Payments extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'carts' })
    cartId: Types.ObjectId

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'users' })
    userId: Types.ObjectId

    @Prop({default: 'pending'})
    paymentStatus: string

    @Prop()
    total: string;

    @Prop()
    bookingId: string

    @Prop()
    paymentId: string

    @Prop({ type: Object, default: {} })
    paymentObject: object

    @Prop({ type: Date })
    payment_date: Date

    @Prop({ type: Date })
    refund_valid: Date

    @Prop({ default: 1 })
    status: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payments);
