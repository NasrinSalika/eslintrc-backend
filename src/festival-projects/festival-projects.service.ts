import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddMediaDto } from './dtos/add-media.dto';
import { AddContactInfoDto } from './dtos/contact-info.dto';
import { CreateProjectInfoDto } from './dtos/create-project-info.dto';
import { AddCreditsDto } from './dtos/credits.dto';
import { ProjectsDocument, FestivalProjects } from './models/project.schema';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FestivalProjectsService {
    constructor(
        @InjectModel(FestivalProjects.name) private projectModel: Model<ProjectsDocument>,
        private config: ConfigService
    ) { }

    async createProjectInformation(data: CreateProjectInfoDto) {
        const project = new this.projectModel(data);
        return await project.save();
    }

    async getSingleProject(id: string, userId: string) {
        if (!id) return null;
        return this.projectModel.findOne({ _id: Types.ObjectId(id), status: 1, userId }).exec();
    };

    async findOneUpdate(id: string, data: any) {
        const project = await this.getSingleProject(id, data.userId);
        if (!project) throw new NotFoundException('Project Not found');
        Object.assign(project, data);
        return project.save()
    };

    async updateProjectInfo(id: string, data: Partial<CreateProjectInfoDto>) {
        const project = await this.findOneUpdate(id, data);
        return project;
    };

    async findOne(data: any) {
        return await this.projectModel.findOne(data).lean();
    };

    async addContactInfo(id: string, data: Partial<AddContactInfoDto>) {
        const project = await this.findOneUpdate(id, data);
        return project;
    };

    async addCreditsToProject(id: string, data: Partial<AddCreditsDto>) {
        const project = await this.findOneUpdate(id, data);
        return project;
    };

    async addSpecificationToProject(id: string, data: Partial<AddCreditsDto>) {
        const project = await this.findOneUpdate(id, data);
        return project;
    };

    async getProjectList(query: any) {
        let gIntDataPerPage = (query.offset == 0 || !query.offset) ? 8 : parseInt(query.offset)

        //Pagination
        let page = query.page || 1;
        let skipRec = page - 1;
        skipRec = skipRec * gIntDataPerPage;

        let limit = Number(query.limit);
        let pageLimit;
        if (limit) {
            pageLimit = limit;
        } else {
            pageLimit = gIntDataPerPage;
        }

        const project = await this.projectModel.aggregate([
            {
                $match: {
                    userId: Types.ObjectId(query.id),
                    status: 1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $unwind: {
                    path: '$userId',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "projecttypes",
                    localField: "projectType",
                    foreignField: "_id",
                    as: "projectType"
                }
            },
            {
                $lookup: {
                    from: "festivalprojectcategories",
                    localField: "projectCategory",
                    foreignField: "_id",
                    as: "projectCategory"
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "media",
                    foreignField: "_id",
                    as: "media"
                }
            },
            {
                $unwind: {
                    path: '$media',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $project: {
                    "_id": 1,
                    "status": 1,
                    "screenId": 1,
                    "isAnotherLanguageTitle": 1,
                    "projectType": 1,
                    "projectTitle": 1,
                    "description": 1,
                    "userId": {
                        "_id": "$userId._id",
                        "isVerified": "$userId.isVerified",
                        "loginAttempts": "$userId.loginAttempts",
                        "role": "$userId.role",
                        "isFestivalManager": "$userId.isFestivalManager",
                        "firstName": "$userId.firstName",
                        "lastName": "$userId.lastName",
                        "company": "$userId.company",
                        "email": "$userId.email",
                        "date": "$userId.date",
                        "lastLoggedIn": "$userId.lastLoggedIn"
                    },
                    "createdAt": 1,
                    "updatedAt": 1,
                    "address": 1,
                    "birthDate": 1,
                    "category": 1,
                    "director": 1,
                    "distributionInfo": 1,
                    "email": 1,
                    "gender": 1,
                    "keyCasts": 1,
                    "languages": 1,
                    "phoneNumber": 1,
                    "producers": 1,
                    "screeningAndAwards": 1,
                    "writers": 1,
                    "awardsWon": 1,
                    "projectCategory": 1,
                    "genres": 1,
                    "budget": 1,
                    "completionDate": 1,
                    "countryOfOrigin": 1,
                    "runtime": 1,
                    "aspectRatio": 1,
                    "countryOfFilming": 1,
                    "filmColour": 1,
                    "firstTimeFilmMaker": 1,
                    "shootingFormat": 1,
                    "studentProject": 1,
                    "media": {
                        "_id": "$media._id",
                        "status": "$media.status",
                        "fileName": "$media.fileName",
                        "mimeType": "$media.mimeType",
                        "key": "$media.key",
                        "userId": "$media.userId",
                        "fileType": "$media.fileType",
                        "createdAt": "$media.createdAt",
                        "updatedAt": "$media.updatedAt",
                        "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$media.key"] },
                    }
                }
            },
            { $skip: skipRec },
            { $limit: pageLimit }
        ]);

        return {
            items: project,
            total: Math.round(project.length / (limit ? limit : gIntDataPerPage)),
            totalProjects: project.length,
            per_page: limit ? limit : gIntDataPerPage,
            currentPage: page
        }
    };

    async viewProject(id: string, userId: string) {
        const project = await this.projectModel.aggregate([
            {
                $match: {
                    _id: Types.ObjectId(id),
                    userId: Types.ObjectId(userId),
                    status: 1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $unwind: {
                    path: '$userId',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "projecttypes",
                    localField: "projectType",
                    foreignField: "_id",
                    as: "projectType"
                }
            },
            {
                $lookup: {
                    from: "festivalprojectcategories",
                    localField: "projectCategory",
                    foreignField: "_id",
                    as: "projectCategory"
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "media",
                    foreignField: "_id",
                    as: "media"
                }
            },
            {
                $unwind: {
                    path: '$media',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $project: {
                    "_id": 1,
                    "status": 1,
                    "screenId": 1,
                    "isAnotherLanguageTitle": 1,
                    "projectType": 1,
                    "projectTitle": 1,
                    "description": 1,
                    "userId": {
                        "_id": "$userId._id",
                        "isVerified": "$userId.isVerified",
                        "loginAttempts": "$userId.loginAttempts",
                        "role": "$userId.role",
                        "isFestivalManager": "$userId.isFestivalManager",
                        "firstName": "$userId.firstName",
                        "lastName": "$userId.lastName",
                        "company": "$userId.company",
                        "email": "$userId.email",
                        "date": "$userId.date",
                        "lastLoggedIn": "$userId.lastLoggedIn"
                    },
                    "createdAt": 1,
                    "updatedAt": 1,
                    "address": 1,
                    "birthDate": 1,
                    "category": 1,
                    "director": 1,
                    "distributionInfo": 1,
                    "email": 1,
                    "gender": 1,
                    "keyCasts": 1,
                    "languages": 1,
                    "phoneNumber": 1,
                    "producers": 1,
                    "screeningAndAwards": 1,
                    "writers": 1,
                    "awardsWon": 1,
                    "projectCategory": 1,
                    "genres": 1,
                    "budget": 1,
                    "completionDate": 1,
                    "countryOfOrigin": 1,
                    "runtime": 1,
                    "aspectRatio": 1,
                    "countryOfFilming": 1,
                    "filmColour": 1,
                    "firstTimeFilmMaker": 1,
                    "shootingFormat": 1,
                    "studentProject": 1,
                    "media": {
                        "_id": "$media._id",
                        "status": "$media.status",
                        "fileName": "$media.fileName",
                        "mimeType": "$media.mimeType",
                        "key": "$media.key",
                        "userId": "$media.userId",
                        "fileType": "$media.fileType",
                        "createdAt": "$media.createdAt",
                        "updatedAt": "$media.updatedAt",
                        "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$media.key"] },
                    }
                }
            },
        ]);

        return project ? project[0] : {};;
    };

    async removeProject(id: string, userId: string) {
        return await this.projectModel.findOneAndUpdate({
            _id: Types.ObjectId(id),
            userId: Types.ObjectId(userId),
            status: 1
        }, {
            $set: {
                status: 0
            }
        }, { new: true }).exec()
    };

    async addMedia(data: AddMediaDto, userId: string) {
        const project = await this.getSingleProject(data.projectId, userId);
        if (!project) throw new NotFoundException('Festival Not found');
        let lObj = {
            media: data.media
        }
        Object.assign(project, lObj);
        return project.save()
    }
}
