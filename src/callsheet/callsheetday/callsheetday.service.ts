import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CallsheetDay, CallsheetDayDocument} from '../models/callsheet_day.schema';
import { CallsheetDayInfo, CallsheetDayInfoDocument } from '../models/callsheet_day_info.schema';

@Injectable()
export class CallsheetdayService {
    constructor(
        @InjectModel(CallsheetDay.name) private dayModel: Model<CallsheetDayDocument>,
        @InjectModel(CallsheetDayInfo.name) private infoModel: Model<CallsheetDayInfoDocument>
    ) { };

    async insertMultiple(data:any ) {
        return await this.dayModel.insertMany(data) 
    };

    async findAll(data: any) {
        return await this.dayModel.find(data).populate('users').populate('callsheets').sort({ callSheetDay: 1 });
    };

    async findAllCallSheetDay(data) {
        try {
            const callsheets = await this.dayModel.aggregate([ 
                {
                    $lookup: {
                        from: "callsheets",
                        localField: "callSheetId",
                        foreignField: "_id",
                        as: "callSheet",
                    },
                },
                { $unwind: { path: "$callSheet", preserveNullAndEmptyArrays: true } },
                {
                    $set: {
                        "callSheet.projectId": { $toObjectId: "$callSheet.projectId" }
                    }
                },
                {
                    $lookup: {
                        from: "projectteammembers",
                        localField: "callSheet.projectId",
                        foreignField: "projectId",
                        as: "projectTeamMembers",
                    },
                },
                {
                    $lookup: {
                        from: "individualinvites",
                        localField: "callSheet._id",
                        foreignField: "appId",
                        as: "individualInvites",
                    },
                },
                {
                    $unwind: {
                        path: "$projectTeamMembers",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: data
                },
        ]);
        return callsheets;
        } catch (error) {
            throw new Error('Unable to fetch callsheets with info.');
        }
    }

    async findOne(data: any) {
        return await this.dayModel.findOne(data).exec();
    };

    async deleteMany(data:any ) {
        return await this.dayModel.deleteMany(data) 
    };

    async deleteOne(data:any ) {
        return await this.dayModel.deleteOne(data) 
    };

    async createInfo(data:any) {
        const info = new this.infoModel(data);
        return await info.save();
    };

    async findOneInfo(data: any) {
        return await this.infoModel.findOne(data).exec();
    };

    async findOneInfoWithTeamMembers(user,dayId) {
    try {
        const oneInfo = await this.infoModel.aggregate([ 
            {
                $match: {
                    status:1,
                    dayId: Types.ObjectId(dayId),
                }
            },
        {
            $lookup: {
                from: "callsheetdays",
                localField: "dayId",
                foreignField: "_id",
                as: "dayIdInfo",
            },
        },
        { $unwind: { path: "$dayIdInfo", preserveNullAndEmptyArrays: true } }, 
        {
            $lookup: {
                from: "callsheets",
                localField: "dayIdInfo.callSheetId",
                foreignField: "_id",
                as: "callsheet",
            },
        },
        { $unwind: { path: "$callsheet", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                "callsheet.projectId": { $toObjectId: "$callsheet.projectId" }
            }
        },
        {
            $lookup: {
                from: "projectteammembers",
                localField: "callsheet.projectId",
                foreignField: "projectId",
                as: "projectTeamMembers",
            },
        },
        {
            $unwind: {
                path: "$projectTeamMembers",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: {
                $or: [
                    { "userId": user._id },
                    { "projectTeamMembers.projectTeamMember.email": user.email },
                    { "projectTeamMembers.createdBy":user._id}
                ]
            },
        },
    ]);
    return oneInfo;
    } catch (error) {
        throw new Error('Unable to fetch callsheets with info.');
    }
    };

    async deleteOneInfo(data:any ) {
        return await this.infoModel.deleteOne(data) 
    };

    async getAllInfoByDayId(user,dayId) { 
        let info =  await this.infoModel.aggregate([
            {
                $match: {
                    status:1,
                    dayId: Types.ObjectId(dayId),
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
            {
                $lookup: {
                    from: "callsheetdays",
                    localField: "dayId",
                    foreignField: "_id",
                    as: "dayId",
                },
            },
            { $unwind: { path: "$dayId", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "callsheets",
                    localField: "dayId.callSheetId",
                    foreignField: "_id",
                    as: "callsheet",
                },
            },
            { $unwind: { path: "$callsheet", preserveNullAndEmptyArrays: true } },
            {
                $set: {
                    "callsheet.projectId": { $toObjectId: "$callsheet.projectId" }
                }
            },
            {
                $lookup: {
                    from: "projectteammembers",
                    localField: "callsheet.projectId",
                    foreignField: "projectId",
                    as: "projectTeamMembers",
                },
            },
            {
                $unwind: {
                    path: "$projectTeamMembers",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "individualinvites",
                    localField: "callsheet._id",
                    foreignField: "appId",
                    as: "individualInvites",
                },
            },
            {
                $match: {
                    $or: [
                        { "userId._id": user._id },
                        { "projectTeamMembers.projectTeamMember.email": user.email },
                        { "projectTeamMembers.createdBy":user._id},
                        {"individualInvites.inviteInfo.email": {$in: [user.email]} },
                        {"individualInvites.createdBy":{$in: [user._id]} },
                    ]
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "callsheet.userId",
                    foreignField: "_id",
                    as: "callsheet.userId",
                },
            },
            { $unwind: { path: "$callsheet.userId", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "callsheetdays",
                    localField: "dayId.callSheetId",
                    foreignField: "callSheetId",
                    as: "days",
                },
            },
            {
                $lookup: {
                    from: "locations",
                    localField: "location.productionOffice",
                    foreignField: "_id",
                    as: "location.productionOffice",
                },
            },
            { $unwind: { path: "$location.productionOffice", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "locations",
                    localField: "location.parking",
                    foreignField: "_id",
                    as: "location.parking",
                },
            },
            { $unwind: { path: "$location.parking", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "locations",
                    localField: "location.nearestHospital",
                    foreignField: "_id",
                    as: "location.nearestHospital",
                },
            },
            { $unwind: { path: "$location.nearestHospital", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "locations",
                    localField: "location.basecamp",
                    foreignField: "_id",
                    as: "location.basecamp",
                },
            },
            { $unwind: { path: "$location.basecamp", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts.producer",
                    foreignField: "_id",
                    as: "contacts.producer",
                },
            },
            { $unwind: { path: "$contacts.producer", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts.co_producer",
                    foreignField: "_id",
                    as: "contacts.co_producer",
                },
            },
            { $unwind: { path: "$contacts.co_producer", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts.segment_producer",
                    foreignField: "_id",
                    as: "contacts.segment_producer",
                },
            },
            { $unwind: { path: "$contacts.segment_producer", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts.line_producer",
                    foreignField: "_id",
                    as: "contacts.line_producer",
                },
            },
            { $unwind: { path: "$contacts.line_producer", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts.director",
                    foreignField: "_id",
                    as: "contacts.director",
                },
            },
            { $unwind: { path: "$contacts.director", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts.assistant_director",
                    foreignField: "_id",
                    as: "contacts.assistant_director",
                },
            },
            { $unwind: { path: "$contacts.assistant_director", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "contacts",
                    localField: "contacts.screen_writer",
                    foreignField: "_id",
                    as: "contacts.screen_writer",
                },
            },
            { $unwind: { path: "$contacts.screen_writer", preserveNullAndEmptyArrays: true } },
        ]);

        return info?.length > 0 ? info[0] : {}
    }
}
