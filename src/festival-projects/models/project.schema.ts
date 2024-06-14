import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import { ProjectTypes } from "./project-type.schema";
import { FestivalProjectCategory } from "./project-category.schema";
import { FestivalFiles } from "src/festival/models/files.schema";

export type ProjectsDocument = FestivalProjects & Document;

@Schema({timestamps: true})
export class FestivalProjects extends Document {
    @Prop({ required: true })
    projectTitle: string;

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'projecttypes' })
    projectType: ProjectTypes;

    @Prop()
    description: string;

    @Prop({
        default: false
    })
    isAnotherLanguageTitle: boolean;

    @Prop()
    aProjectTitle: string;

    @Prop()
    aDescription: string;

    @Prop()
    website: string;

    @Prop()
    twitter: string;

    @Prop()
    facebook: string;

    @Prop()
    instagram: string;

    @Prop()
    email: string;

    @Prop()
    phoneNumber: number;

    @Prop({
        type: Object
    })
    address: object;

    @Prop()
    birthDate: Date;

    @Prop()
    gender: string;

    @Prop({
        default: []
    })
    director: object[]

    @Prop({
        default: []
    })
    writers: object[]

    @Prop({
        default: []
    })
    producers: object[]

    @Prop({
        default: []
    })
    keyCasts: object[]

    //film porperty
    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'festivalprojectcategories' }]
    })
    projectCategory: FestivalProjectCategory[];

    @Prop({
        default: []
    })
    genres: string[];

    @Prop({
        type: Object
    })
    runtime: object

    @Prop()
    completionDate: Date;

    @Prop({
        type: Object
    })
    budget: object

    @Prop()
    countryOfOrigin: string

    @Prop()
    countryOfFilming: string

    @Prop({
        type: Array,
        default: []
    })
    languages: string[];

    @Prop()
    shootingFormat: string

    @Prop()
    aspectRatio: string

    @Prop()
    filmColour: string

    @Prop()
    studentProject: boolean

    @Prop()
    schoolName: string

    @Prop()
    firstTimeFilmMaker: boolean

    // script
    @Prop()
    numberOfPages: number

    @Prop()
    firstTimeScreenWriter: boolean

    //music
    @Prop({
        type: Object
    })
    musicLength: object

    // camera property
    @Prop()
    dateTaken: Date

    @Prop()
    camera: string

    @Prop()
    Lens: string

    @Prop()
    foucsLength: string

    @Prop()
    shutterSpeed: string

    @Prop()
    aperture: string

    @Prop()
    isoFilm: string

    @Prop({
        default: []
    })
    awardsWon: object[];

    @Prop({
        default: []
    })
    screeningAndAwards: object[];

    @Prop({
        default: []
    })
    distributionInfo: object[];

    @Prop({ default: 1 })
    screenId: number

    @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'users' })
    userId: Types.ObjectId

    @Prop({ default: 1 })
    status: number;
    
    @Prop({
        type: MongooseSchema.Types.ObjectId, ref: 'festivalfiles'
    })
    media: FestivalFiles;

}

export const ProjectsSchema = SchemaFactory.createForClass(FestivalProjects);
