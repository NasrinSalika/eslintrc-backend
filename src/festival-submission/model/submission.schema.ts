import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

export type SubmissionDocument = FestivalSubmission & Document;

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
export class FestivalSubmission extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'festivals' })
    festivalId: Types.ObjectId

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'festivalprojects' })
    projectId: Types.ObjectId

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'users' })
    userId: Types.ObjectId

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'statustypes', default: "61149aa6038d973ccc2470bf" })
    submission_status: Types.ObjectId

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'statustypes', default: "61149aa6038d973ccc2470bf" })
    judging_status: Types.ObjectId

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'statustypes' })
    flag: Types.ObjectId

    @Prop({ type: ItemSchema })
    category: Items;

    @Prop({ type: String })
    amount_paid: string

    @Prop({ type: String })
    cover_letter: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'payments' })
    submissionPaymentId: Types.ObjectId
    
    @Prop({ default: 1 })
    status: number;
}

export const SubmissionSchema = SchemaFactory.createForClass(FestivalSubmission);
