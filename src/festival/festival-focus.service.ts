import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FestivalFocus, FestivalFocusDocument } from './models/festivalfocus.schema';
import { Countries, CountriesDocument } from './models/country.schema';
import { Currencies, CurrencyDocument } from './models/currency.schema';
import { CreateFocusDto } from './dtos/create-focus.dto';

@Injectable()
export class FestivalFocusService {
    constructor(@InjectModel(FestivalFocus.name) private festivalModel: Model<FestivalFocusDocument>, @InjectModel(Countries.name) private countriesModel: Model<CountriesDocument>, @InjectModel(Currencies.name) private currencyModel: Model<CurrencyDocument>) {}

    async createFocus(data: CreateFocusDto) {
        const event = new this.festivalModel(data);
        return event.save();
    }

    async findOne(data: any) {
        return this.festivalModel.findOne(data);
    }   

    async findAll() {
        return this.festivalModel.find({ status: 1 })
    }

    async getAll() {
        return this.countriesModel.find().sort({ id: 1 }).exec()
    }

    async getAllCurrency() {
        return this.currencyModel.find().sort({ id: 1 }).exec()
    }
}
