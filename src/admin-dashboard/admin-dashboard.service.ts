import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Festivals, FestivalsDocument } from 'src/festival/models/festival.schema';

@Injectable()
export class AdminDashboardService {
    constructor(
        @InjectModel(Festivals.name) private festivalModel: Model<FestivalsDocument>
    ) {}
    

    async getAllFestivalsCount() {
        return await this.festivalModel.find({
            status: 1
        }).lean()
    }
}
