import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument} from './models/category.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

    async createCategory(data: CreateCategoryDto) {
        const event = new this.categoryModel(data);
        return event.save();
    }

    async findOne(data: any) {
        return this.categoryModel.findOne(data);
    }   

    async findAll(data:any = {}) {
        let q ={};
        
        if(data && data.id != undefined) {
            q["events"] = { $in: data.id };
            q["status"] = 1
        } else {
            q["status"] = 1
        };
 
        return this.categoryModel.find(q)
    }

    async findByEventId(data: any) {
        return this.categoryModel.find({
            events: { $in: data._id },
            status: 1
        });
    }

    async findOneAndUpdate(data: any) {
        return this.categoryModel.findOneAndUpdate({
            _id: data._id,
            status: 1
        }, {
            $set: {
                events: data.events
            }
        }, { new: true })
    }
}
