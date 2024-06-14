import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectTypes, ProjectTypesDocument } from './models/project-type.schema';
import { CreateProjectTypeDto } from './dtos/create-project-type.dto';
import { FestivalProjectCategory, ProjectCategoryDocument } from './models/project-category.schema';
import { CreateProjectCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class ProjectTypeService {
    constructor(
        @InjectModel(ProjectTypes.name) private typeModel: Model<ProjectTypesDocument>,
        @InjectModel(FestivalProjectCategory.name) private categoryModel: Model<ProjectCategoryDocument>
    ) {}

    async createProjectType(data: CreateProjectTypeDto) {
        const event = new this.typeModel(data);
        return event.save();
    }

    async findOne(data: any) {
        return this.typeModel.findOne(data);
    }   

    async findAll() {
        return this.typeModel.find({ status: 1 })
    }
    
    async createCategory(data: CreateProjectCategoryDto) {
        const type = new this.categoryModel(data);
        return type.save();
    }

    async findOneCategory(data: any) {
        return this.categoryModel.findOne(data);
    }   

    async findAllCategory(data:any = {}) {
        let q ={};
        
        if(data && data.id != undefined) {
            q["types"] = { $in: data.id };
            q["status"] = 1
        } else {
            q["status"] = 1
        };
 
        return this.categoryModel.find(q)
    }

    async findByEventId(data: any) {
        return this.categoryModel.find({
            types: { $in: data._id },
            status: 1
        });
    }

    async findOneAndUpdate(data: any) {
        return this.categoryModel.findOneAndUpdate({
            _id: data._id,
            status: 1
        }, {
            $set: {
                types: data.types
            }
        }, { new: true })
    }
 
}
