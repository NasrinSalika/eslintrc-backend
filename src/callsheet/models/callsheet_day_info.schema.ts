import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

export type CallsheetDayInfoDocument = CallsheetDayInfo & Document;

class Timing {
    @Prop({ type: String })
    callTime: String

    @Prop({ type: String })
    shootTime: String

    @Prop({ type: String })
    wrapTime: String
};

class FoodInfo {
    @Prop({ type: String })
    startTime: String

    @Prop({ type: String })
    duration: String

    @Prop({ type: Number })
    count: number
};

class Location {
    @Prop({ type: Types.ObjectId, ref: "locations" })
    productionOffice: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "locations" })
    nearestHospital: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "locations" })
    parking: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "locations" })
    basecamp: Types.ObjectId
};

class Weather {
    @Prop({ type: String })
    lowTemp: String

    @Prop({ type: String })
    highTemp: String

    @Prop({ type: String })
    sunrise: string

    @Prop({ type: String })
    sunset: string

    @Prop({ type: String })
    summary: string
};

class Miscellaneous {
    @Prop({ type: Number })
    totalDays: number

    @Prop({ type: String })
    scriptVersion: string

    @Prop({ type: String })
    scheduleVersion: string
};

class Standins {
    @Prop({ type: Number })
    quantity: number;

    @Prop({ type: String })
    description: string;

    @Prop({ type: String })
    arrivalTime: string;

    @Prop({ type: String })
    extraType: string;

    @Prop({ type: String })
    setTime: string;
}

class GeneralNotes {
    @Prop({ type: String })
    frontNotes: string

    @Prop({ type: String })
    backNotes: string
};

class DepartmentNotes {
    // @Prop({ type: Types.ObjectId, ref: 'departments' })
    // departmentId: Types.ObjectId

    @Prop({ type: String })
    departmentId: string

    @Prop({ type: String })
    backNotes: string
};

class Reminders {
    @Prop({ type: String })
    notes: string
};

class Layout {
    @Prop({ type: String })
    title: string

    @Prop({ type: String })
    key: string
};


class Contacts {
    @Prop({ type: Types.ObjectId, ref: "contacts" })
    producer: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "contacts" })
    co_producer: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "contacts" })
    segment_producer: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "contacts" })
    line_producer: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "contacts" })
    director: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "contacts" })
    assistant_director: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "contacts" })
    screen_writer: Types.ObjectId
};

class Casts {
    @Prop({ type: String })
    pickupTime: String

    @Prop({ type: String })
    arrivalTime: String

    @Prop({ type: String })
    blkTime: String

    @Prop({ type: String })
    wardTime: String

    @Prop({ type: String })
    setTime: String

    @Prop({ type: String })
    remarks: String

    @Prop({ type: String })
    status: String

    @Prop({ type: Types.ObjectId, ref: 'casts' })
    castId: Types.ObjectId

    @Prop({ type: String })
    castName: string

    @Prop({ type: String })
    characterName: string
};

class Medic {
    @Prop({ type: Types.ObjectId, ref: 'casts' })
    medicId: Types.ObjectId

    @Prop({ type: String })
    medicName: string

    @Prop({ type: String })
    medicRole: string
}

class Scenes {
    @Prop({ type: Array, default: [] })
    characters: []

    @Prop({ type: String, default: "" })
    heading: string

    @Prop({ type: String, default: "" })
    ie: string

    @Prop({ type: String, default: "" })
    pages: string

    @Prop({ type: Number, default: null })
    scene: number

    @Prop({ type: Number, default: null })
    sequence: number

    @Prop({ type: String, default: "" })
    textData: string

    @Prop({ type: String, default: "" })
    time: string

    @Prop({ type: String, default: "" })
    title: string

    @Prop({ type: String, default: "" })
    type: string

    @Prop({ type: String, default: "" })
    _id: string

    @Prop({ type: Types.ObjectId, ref: "locations", default: null })
    locationId?: Types.ObjectId

    @Prop({ type: String, default: null })
    locationName: string
}

class IsSectionVisible {
    @Prop({ type: Boolean, default: true })
    cast: boolean;
    @Prop({ type: Boolean, default: true })
    extras: boolean;
    @Prop({ type: Boolean, default: true })
    departmentNotes: boolean;
    @Prop({ type: Boolean, default: true })
    todaysSchedule: boolean;
    @Prop({ type: Boolean, default: true })
    usefulContacts: boolean;
    @Prop({ type: Boolean, default: true })
    additionalNotes: boolean;
    @Prop({ type: Boolean, default: true })
    productionTitle: boolean;
    @Prop({ type: Boolean, default: true })
    logo: boolean;
}

@Schema({ timestamps: true })
export class CallsheetDayInfo extends Document {
    @Prop({ type: Object, default: null })
    layout: Layout

    @Prop({ type: Object, default: null })
    shootTiming: Timing

    @Prop({ type: Object, default: null })
    breakfast: FoodInfo

    @Prop({ type: Object, default: null })
    firstMeal: FoodInfo

    @Prop({ type: Object, default: null })
    secondMeal: FoodInfo

    @Prop({ type: Object, default: null })
    location: Location

    @Prop({ type: Object, default: null })
    weather: Weather

    @Prop({ type: Object, default: null })
    medic: Medic

    @Prop({ type: Object, default: null })
    miscellaneous: Miscellaneous

    @Prop({ type: [{ type: Object, default: {} }], default: [] })
    scenes: Array<Scenes>;

    @Prop({ type: [{ type: Object, default: {} }], default: [] })
    casts: Array<Casts>;

    @Prop({ type: Object, default: null })
    contacts: Contacts;

    @Prop({ type: [{ type: Object, default: {} }], default: [] })
    extras: Array<Standins>;

    @Prop({ type: Object, default: null })
    generalNotes: GeneralNotes

    @Prop({ type: [{ type: Object, default: {} }], default: [] })
    departmentNotes: Array<DepartmentNotes>

    @Prop({ type: [{ type: Object, default: {} }], default: [] })
    productionReminders: Array<Reminders>

    @Prop({ type: Types.ObjectId, ref: 'callsheetdays' })
    dayId: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'users' })
    userId: Types.ObjectId

    @Prop({ type: Number, default: 1 })
    status: number;

    @Prop({ type: Object })
    isSectionVisible: IsSectionVisible;
    @Prop({ type: Object})
    usefulContacts: Object;
}

export const CallsheetDayInfoSchema = SchemaFactory.createForClass(CallsheetDayInfo);