import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Callsheet, CallsheetDocument } from './models/callsheet.schema';

@Injectable()
export class CallsheetService {
    constructor(
        @InjectModel(Callsheet.name) private callsheetModel: Model<CallsheetDocument>
    ) { };

    async create(data: any) {
        const sheet = new this.callsheetModel(data);
        return await sheet.save();
    };

    async findOne(data: any) {
        return await this.callsheetModel.findOne(data).exec();
    };

    async findAll(data: any) {
        return await this.callsheetModel.find(data).populate('users').sort({ createdAt: -1  });
    };
    
    async getAllCallSheetWithProjectTeamMembers(user,projectId): Promise<Callsheet[]> {
        try {
            const callsheets = await this.callsheetModel.aggregate([
            {
                $set: {
                    projectId: { $toObjectId: "$projectId" }
                }
            },
            {
                $lookup: {
                from: "userprojects",
                localField: "projectId",
                foreignField: "_id",
                as: "Projects",
                },
            },
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
                $unwind: {
                path: "$projectTeamMembers",
                preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                from: "projectteammembers", 
                localField: "projectId",
                foreignField: "projectId",
                as: "projectTeamMembers",
                },
            },
            {
                $lookup: {
                    from: "individualinvites",
                    localField: "_id",
                    foreignField: "appId",
                    as: "individualInvites",
                },
            },
            {
                $lookup: {
                from: "callsheetmembers", 
                localField: "_id",
                foreignField: "callsheetId",
                as: "members",
                },
            },
            {
                $match: {
                    status: 1,
                    projectId: Types.ObjectId(projectId)
                },
            },
            {
                $match: {
                    $or: [
                        { "userId._id": user._id },
                        { "callsheetmembers.email": { $in: [user.email] } },
                        { "projectTeamMembers.projectTeamMember.email": user.email },
                        { "projectTeamMembers.createdBy": user._id},
                        {"individualInvites.inviteInfo.email":user.email },
                        {"individualInvites.createdBy":user._id },
                        { "Projects.createdBy": user._id },
                    ]
                },
            },
            ]);
        return callsheets;
        } catch (error) {
            throw new Error('Unable to fetch callsheets with info.');
        }
    }

    async getAllCallSheetBySheetId (user,sheetId): Promise<Callsheet[]> {
        try {
            const callsheets = await this.callsheetModel.aggregate([
            {
                $lookup: {
                from: "userprojects",
                localField: "projectId",
                foreignField: "_id",
                as: "Projects",
                },
            },
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
                $unwind: {
                path: "$projectTeamMembers",
                preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                from: "projectteammembers", 
                localField: "projectId",
                foreignField: "projectId",
                as: "projectTeamMembers",
                },
            },
            {
                $lookup: {
                    from: "individualinvites",
                    localField: "_id",
                    foreignField: "appId",
                    as: "individualInvites",
                },
            },
            {
                $unwind: {
                path: "$individualInvites",
                preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    status: 1,
                    _id: Types.ObjectId(sheetId)
                },
            },
            {
                $match: {
                    $or: [
                        { "userId._id": user._id },
                        { "projectTeamMembers.projectTeamMember.email": user.email },
                        { "projectTeamMembers.createdBy": user._id},
                        {"individualInvites.inviteInfo.email": {$in: [user.email]} },
                        {"individualInvites.createdBy":{$in: [user._id]} },
                        { "Projects.createdBy": user._id },
                    ]
                },
            },
            ]);
        return callsheets;
        } catch (error) {
            throw new Error('Unable to fetch callsheets with info.');
        }
    }

    async findOneAndUpdate(callsheetId: Types.ObjectId, data: any) {
        let sheet = await this.findOne({ _id: callsheetId, status: 1 })
        if (!sheet) throw new NotFoundException('Callsheet Not found');
        Object.assign(sheet, data);
        return sheet.save()
    };

    async removeSheet(data: any) {
        return this.callsheetModel.deleteMany(data).exec()
    };

    async findCallsheetById(data: any) {
        const callsheet = await this.callsheetModel.aggregate([
            {
                $match: data
            },
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
                    "_id" : 1,
                    "status" : 1,
                    "workingDays": 1,
                    "name" : 1,
                    "startDate": 1,
                    "endDate" : 1,
                    "projectId" : 1,
                    "createdAt" : 1,
                    "updatedAt" : 1,
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
                        "stripeCustId": "$userId.stripeCustId",
                        "plan": "$userId.plan",
                        "planLabel": "$userId.planLabel",
                        "planId": "$userId.planId",
                        "trialDescription": "$userId.trialDescription",
                        "lastLoggedIn": "$userId.lastLoggedIn",
                        "planSpace": "$userId.planSpace"
                    }
                }            
            }
        ]);
    
        return callsheet ? callsheet[0] : null; 
    }
}
