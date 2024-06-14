import { objectTypeIndexer } from "@babel/types";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import { EventTypes } from "./eventType.schema";
import { Category } from "./category.schema";
import { FestivalFocus } from "./festivalfocus.schema";
import { FestivalFiles } from "./files.schema";

export type FestivalsDocument = Festivals & Document;

@Schema({timestamps: true})
export class Festivals extends Document {
    @Prop({ required: true })
    eventName: string;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'eventtypes' }]
    })
    eventType: EventTypes[]

    @Prop({
        type: MongooseSchema.Types.ObjectId, ref: 'festivalfiles'
    })
    logo: FestivalFiles;

    @Prop({
        type: MongooseSchema.Types.ObjectId, ref: 'festivalfiles'
    })
    coverImg: FestivalFiles;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'festivalfiles' }]
    })
    photos: FestivalFiles[];

    @Prop()
    yearsOfRunning: number;

    @Prop()
    description: string;

    @Prop()
    awardsAndPrices: string;

    @Prop()
    rulesAndTerms: string;

    @Prop({
        default: []
    })
    eventOrganiser: object[];

    @Prop({
        type: Object
    })
    keyStats: object;

    @Prop()
    website: string;

    @Prop()
    email: string;

    @Prop({
        default: ""
    })
    phoneNumber: number;

    @Prop({
        type: Object
    })
    address: object;

    @Prop({
        type: Object
    })
    socialMediaLinks: object;

    @Prop({
        default: false
    })
    isSubmissionAddress: boolean;

    @Prop({
        type: Object
    })
    submissionAddresss: object;

    @Prop({
        default: []
    })
    eventVenue: object[];

    @Prop()
    openingDate: Date;

    @Prop()
    notificationDate: Date;

    @Prop({
        type: Object
    })
    eventDate: Object;

    @Prop({
        default: []
    })
    deadlines: object[]

    @Prop()
    currency: string;

    @Prop({
        default: []
    })
    pricingCategory: object[]

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'categories' }]
    })
    categorySearch: Category[]

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'festivalfocus' }]
    })
    festivalFocus: FestivalFocus[]

    @Prop({
        default: []
    })
    searchTerms: string[]

    @Prop({
        type: Object
    })
    runtime: object

    @Prop({
        default: false
    })
    allLengthAccepted: boolean;

    @Prop({ type: String })
    listingUrl: string

    @Prop({
        default: false
    })
    listingVisibility: boolean;

    @Prop({
        default: true
    })
    isOpen: boolean;

    @Prop({
        type: Object
    })
    trackingSequence: object

    @Prop({ default: 1 })
    screenId: number

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'users' })
    userId: Types.ObjectId

    @Prop({ default: 1 })
    status: number;

    @Prop({ default: false })
    isApproved: boolean;

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'users' })
    approverId: Types.ObjectId
}

export const FestivalsSchema = SchemaFactory.createForClass(Festivals);
