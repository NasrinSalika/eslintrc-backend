import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

export type CartDocument = Carts & Document;

@Schema()
class Items extends Document {
    @Prop()
    projectName: string

    @Prop()
    category: string

    @Prop()
    deadline: string

    @Prop()
    price: string

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'users' })
    projectId: Types.ObjectId

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'festivals' })
    festivalId: Types.ObjectId
};

const ItemSchema = SchemaFactory.createForClass(Items);

@Schema({timestamps: true})
export class Carts extends Document {
    @Prop({ type: [ItemSchema] })
    cartItems: Items[];

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'users' })
    userId: Types.ObjectId

    @Prop({default: 'pending'})
    paymentStatus: string

    @Prop()
    total: string;

    @Prop({ default: 1 })
    status: number;
}

export const CartSchema = SchemaFactory.createForClass(Carts);
