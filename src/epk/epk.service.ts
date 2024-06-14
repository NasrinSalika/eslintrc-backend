import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Epks, EpkDocument } from './models/epk.schema';
import { CreateEpkDto } from './dtos/create-epk.dto';
import { InviteMembers, InviteMembersDocs } from './models/invite.schema';
import { AddMembersDto } from './dtos/create-member.dto';
import { RemoveMembrssDto } from './dtos/remove-member.dto';
@Injectable()
export class EpkService {
    constructor(
        @InjectModel(Epks.name) private epkModel: Model<EpkDocument>,
        @InjectModel(InviteMembers.name) private inviteModel: Model<InviteMembersDocs>
    ) { };
    
    async createEpk(data: CreateEpkDto) {
        const epk = new this.epkModel(data);
        return await epk.save();
    };

    async findOneEpk(data: any) {
        return await this.epkModel.findOne(data).exec();
    };

    async getAllEpk(data: any) {
        return await this.epkModel.find(data).exec();
    };

    async getTotalCount(data: any) {
        const epk = await this.epkModel.aggregate([
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
                    from: "invitemembers",
                    localField: "_id",
                    foreignField: "epkId",
                    as: "invitemembers",
                },
            },
            {
                $match: data
            }
        ]);

        return epk;
    };

    async checkAccess(data: any) {
        const epk = await this.epkModel.aggregate([
            {
                $lookup: {
                    from: "invitemembers",
                    localField: "_id",
                    foreignField: "epkId",
                    as: "invitemembers",
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
                $match: data
            },
        ]);

        return epk[0] ? epk[0] : {};
    }

    async getAllEpkMembers(data: any, skipRec, pageLimit, sort) {
        const epk = await this.epkModel.aggregate([
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
                $lookup: {
                    from: "projectteammembers",
                    localField: "projectId",
                    foreignField: "projectId",
                    as: "projectTeamMembers",
                },
            },
            {
                $project: {
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
                    },
                    "_id": 1,
                    "status": 1,
                    "epkName": 1,
                    "projectId": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "width": 1,
                    "height": 1,
                    "projectTeamMembers":1
                }
            },
            {
                $lookup: {
                    from: "invitemembers",
                    localField: "_id",
                    foreignField: "epkId",
                    as: "invitemembers",
                },
            },
            {
                $match: data
            },
            {
                $lookup: {
                    from: "epktemplates",
                    localField: "_id",
                    foreignField: "epkId",
                    as: "epktemplates",
                },
            },
            { $sort: { 'createdAt': -1 } }
        ]);

        return epk;
    };

    async getEpkData(epkId:any) {
        const epk = await this.epkModel.aggregate([
            {
                $match:{
                    status: 1,
                    _id:Types.ObjectId(epkId)
                }
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
    
        ]);
        return epk[0] ? epk[0] : {};
    }

    async finOneAndUpdateEpk(epkId: Types.ObjectId, data: any) {
        const epk = await this.findOneEpk({ _id: epkId, status:1, userId: data.userId});
        if (!epk) throw new NotFoundException('Epk Not found');
        Object.assign(epk, data);
        return epk.save()
    };

    async updateEpk(id: Types.ObjectId, data: Partial<CreateEpkDto>) {
        const epk = await this.finOneAndUpdateEpk(id, data);
        return epk;
    };

    async deleteEpk(data: any) {
        return await this.epkModel.deleteOne(data).exec();
    };

    async deleteManyEpk(data: any) {
        return await this.epkModel.deleteMany(data).exec();
    };

    async checkSigners (data: any) {
        return this.inviteModel.findOne(data).exec();
    };

    async createMembers (data: AddMembersDto) {
        const members = new this.inviteModel(data);
        return await members.save();
    };

    async getAllMembersByEpk(epkId: string) {
        return await this.inviteModel.find({ epkId, status: 1 }).exec()
    };

    async deleteMembers(data: RemoveMembrssDto) {
        return await this.inviteModel.deleteOne(data);
    };

    async getMembersId(epkId: Types.ObjectId, userId: Types.ObjectId, data: any) {
        return await this.inviteModel.findOne({
            email: data.email,
            epkId,
            createdBy: userId
        }).exec()
    };

    async memberFindOneUpdate(epkId: Types.ObjectId, data: any) {
        const member = await this.getMembersId(epkId, data.createdBy, data.emailData);
        if (!member) throw new NotFoundException('Signer Not found');
        Object.assign(member, data);
        return member.save()
    };

    async updateMembers(epkId: Types.ObjectId, data: Partial<AddMembersDto>) {
        const member = await this.memberFindOneUpdate(epkId, data);
        return member;
    };

    async findEpkId(data: any) {
        const epk = await this.epkModel.aggregate([
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
                    "epkName": 1,
                    "height" : 1,
                    "width": 1,
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
    
        return epk ? epk[0] : null; 
    }
}
