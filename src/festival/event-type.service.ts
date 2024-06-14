import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventTypes, EventTypesDocument } from './models/eventType.schema';
import { CreateEventtDto } from './dtos/create-event.dto';

@Injectable()
export class EventTypeService {
    constructor(@InjectModel(EventTypes.name) private eventModel: Model<EventTypesDocument>) {}

    async createEvent(data: CreateEventtDto) {
        const event = new this.eventModel(data);
        return event.save();
    }

    async findOne(data: any) {
        return this.eventModel.findOne(data);
    }   

    async findAll() {
        return this.eventModel.find({ status: 1 })
    }
}
