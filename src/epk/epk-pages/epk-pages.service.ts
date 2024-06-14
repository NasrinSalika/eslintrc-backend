import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EpkPages, EpkPagesDocument } from '../models/epk-pages.schema';

@Injectable()
export class EpkPagesService {
    constructor(
        @InjectModel(EpkPages.name) private pageModel: Model<EpkPagesDocument>
    ) { };

    async createPage(data) {
        const page = new this.pageModel(data);
        return await page.save();
    };

    async findOnePage(data: any) {
        return await this.pageModel.findOne(data).exec();
    };

    async getAllPages(data: any) {
        return await this.pageModel.find(data).exec();
    };

    async finOneAndUpdatePage(pageId: string, data: any) {
        const page = await this.findOnePage({ _id: data.pageId, epkId: Types.ObjectId(pageId), status: 1, userId: data.userId });
        if (!page) throw new NotFoundException('Page Not found');
        Object.assign(page, data);
        return page.save()
    };

    async updatePage(id: string, data: Partial<any>) {
        const page = await this.finOneAndUpdatePage(id, data);
        return page;
    };

    async removePage(pageId: Types.ObjectId, userId: Types.ObjectId) {
        return await this.pageModel.deleteOne({
            _id: pageId,
            userId,
            status: 1
        })
    };

    async getPageWithTeamMembersByEpkId(id,user) {
        const templates = await this.pageModel.aggregate([
            {
                $match: {
                    status: 1,
                    epkId: Types.ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "invitemembers",
                    localField: "epkId",
                    foreignField: "epkId",
                    as: "invitemembers",
                },
            },
            
            {
                $lookup: {
                    from: "epks",
                    localField: "epkId",
                    foreignField: "_id",
                    as: "epkId",
                },
            },
            { $unwind: { path: "$epkId", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "projectteammembers",
                    localField: "epkId.projectId",
                    foreignField: "projectId",
                    as: "projectTeamMembers",
                },
            },
            {
                $lookup: {
                    from: "individualinvites",
                    localField: "epkId._id",
                    foreignField: "appId",
                    as: "individualInvites",
                },
            },
            { $unwind: { path: "$projectTeamMembers", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId",
                },
            },
            { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    $or:[
                        { "userId._id": user._id },
                        { "projectTeamMembers.projectTeamMember.email": user.email }, 
                        { "projectTeamMembers.createdBy": user._id }, 
                        {"individualInvites.inviteInfo.email": user.email },
                        {"individualInvites.createdBy": user._id }
                    ]
                }
            },
            {
                $project: {
                    "_id": 1,
                    "status": 1,
                    "name": 1,
                    "objects": 1,
                    "preview": 1,
                    "projectTeamMembers": 1,
                    "individualInvites" : 1,
                    "epkId": {
                        "_id": "$epkId._id",
                        "status": "$epkId.status",
                        "epkName": "$epkId.epkName",
                        "userId": "$epkId.userId",
                        "createdAt": "$epkId.createdAt",
                        "updatedAt": "$epkId.updatedAt",
                    },
                    "userId": {
                        "_id": "$userId._id",
                        "role": "$userId.role",
                        "isFestivalManager": "$userId.isFestivalManager",
                        "firstName": "$userId.firstName",
                        "lastName": "$userId.lastName",
                        "email": "$userId.email",
                        "date": "$userId.date",
                        "lastLoggedIn": "$userId.lastLoggedIn",
                    },
                    "createdAt": 1,
                    "updatedAt": 1
                }
            }
        ])
        return templates;
    };

    async getPagesForExportByEpkId(data: any) {
        const templates = await this.pageModel.aggregate([
            {
                $lookup: {
                    from: "invitemembers",
                    localField: "epkId",
                    foreignField: "epkId",
                    as: "invitemembers",
                },
            },
            {
                $match: data
            },
            {
                $lookup: {
                    from: "epks",
                    localField: "epkId",
                    foreignField: "_id",
                    as: "epkId",
                },
            },
            { $unwind: { path: "$epkId", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId",
                },
            },
            { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "_id": 1,
                    "status": 1,
                    "name": 1,
                    "objects": 1,
                    "preview": 1,
                    "previewImg": 1,
                    "epkId": {
                        "_id": "$epkId._id",
                        "status": "$epkId.status",
                        "epkName": "$epkId.epkName",
                        "userId": "$epkId.userId",
                        "createdAt": "$epkId.createdAt",
                        "updatedAt": "$epkId.updatedAt",
                    },
                    "userId": {
                        "_id": "$userId._id",
                        "role": "$userId.role",
                        "isFestivalManager": "$userId.isFestivalManager",
                        "firstName": "$userId.firstName",
                        "lastName": "$userId.lastName",
                        "email": "$userId.email",
                        "date": "$userId.date",
                        "lastLoggedIn": "$userId.lastLoggedIn",
                    },
                    "createdAt": 1,
                    "updatedAt": 1
                }
            }
        ])

        return templates;
    };
}
