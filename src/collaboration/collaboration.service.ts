import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IndividualInvite, IndividualInviteDocument } from './models/individual-invites.schema';

@Injectable()
export class CollaborationService {
    constructor(
        @InjectModel(IndividualInvite.name) private inviteModel: Model<IndividualInviteDocument>,
    ) { };

    async checkMembers(data: any) {
        return await this.inviteModel.findOne(data).lean().exec()
    };

    async inviteMembers(data: any) {
        const members = new this.inviteModel(data);
        return await members.save();
    };

    async removeMembers(data: any) {
        return await this.inviteModel.remove(data).exec()
    };

    async getMembersById(data: any, type: any) {
        let appQuery = {};

        switch (type) {
            case 'props':
                appQuery = {
                    $lookup: {
                        from: "props",
                        localField: "appId",
                        foreignField: "_id",
                        as: "appId",
                    },
                };

                break;

            case 'epk':
                appQuery = {
                    $lookup: {
                        from: "epks",
                        localField: "appId",
                        foreignField: "_id",
                        as: "appId",
                    },
                };

                break;

            case 'callsheet':
                appQuery = {
                    $lookup: {
                        from: "callsheets",
                        localField: "appId",
                        foreignField: "_id",
                        as: "appId",
                    },
                };

                break;
        };

        const comments = await this.inviteModel.aggregate([
            {
                $match: data
            },
            appQuery,
            { $unwind: { path: "$appId", preserveNullAndEmptyArrays: true } }
        ]);

        return comments;
    }
}
