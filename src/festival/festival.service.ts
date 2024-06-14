import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Festivals, FestivalsDocument } from './models/festival.schema';
import { FilesDocument, FestivalFiles } from './models/files.schema';
import { CreateFileDto } from './dtos/create-file.dto';
import { CreateEventDetailsDto } from './dtos/create-eventdetails.dto';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { CreateEventDateDto } from './dtos/create-eventdate.dto';
import { CreateEventFeesDto } from './dtos/create-fees.dto';
import { CreateEventSettingsDto } from './dtos/create-additional-setting.dto';
import { AddPhotoDto } from './dtos/add-photos.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { ConfigService } from '@nestjs/config';
import { ApprovedDto } from 'src/admin-dashboard/dtos/add-photos.dto';

@Injectable()
export class FestivalService {
    constructor(@InjectModel(Festivals.name) private festivalModel: Model<FestivalsDocument>, @InjectModel(FestivalFiles.name) private fileModel: Model<FilesDocument>, private config: ConfigService) { }

    async storeFile(data: CreateFileDto) {
        const file = new this.fileModel(data);
        return await file.save();
    };

    async addEventDetails(data: CreateEventDetailsDto) {
        const event = new this.festivalModel(data);
        return await event.save();
    };

    async getSingleEvent(id: string, userId: string) {
        if (!id) return null;
        return this.festivalModel.findOne({ _id: Types.ObjectId(id), status: 1, userId }).exec();
    };

    async findOneUpdate(id: string, data: any) {
        const event = await this.getSingleEvent(id, data.userId);
        if (!event) throw new NotFoundException('Festival Not found');
        Object.assign(event, data);
        return event.save()
    }

    async updateEventDetails(id: string, data: Partial<CreateEventDetailsDto>) {
        const event = await this.findOneUpdate(id, data);
        return event;
    };

    async updateVenueDetails(id: string, data: Partial<CreateVenueDto>) {
        const event = await this.findOneUpdate(id, data);
        return event;
    };

    async updateEventDates(id: string, data: Partial<CreateEventDateDto>) {
        const event = await this.findOneUpdate(id, data);
        return event;
    };

    async updateEventFees(id: string, data: Partial<CreateEventFeesDto>) {
        const event = await this.findOneUpdate(id, data);
        return event;
    };

    async updateEventSetting(id: string, data: Partial<CreateEventSettingsDto>) {
        const event = await this.findOneUpdate(id, data);
        return event;
    };

    async approveFestival(id: string, data: Partial<ApprovedDto>) {
        const festival = await this.festivalModel.findOne({ _id: Types.ObjectId(id), status: 1 }).exec();
        if (!festival) throw new NotFoundException('Festival Not found');
        
        Object.assign(festival, data);
        return festival.save();
    };

    async getFestivals(id: string) {
        return await this.festivalModel.find({ userId: Types.ObjectId(id), status: 1 }).lean();
    };

    async getFestivalById(id: string, userId: string) {
        const festival = await this.festivalModel.aggregate([
            {
                $match: {
                    _id: Types.ObjectId(id),
                    userId: Types.ObjectId(userId),
                    status: 1
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "photos",
                    foreignField: "_id",
                    as: "photos"
                }
            },
            {
                $unwind: {
                    path: '$photos',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $group: {
                    _id: "$_id",
                    "status": { $first: "$status" },
                    "screenId": { $first: "$screenId" },
                    "listingVisibility": { $first: "$listingVisibility" },
                    "allLengthAccepted": { $first: "$allLengthAccepted" },
                    "searchTerms": { $first: "$searchTerms" },
                    "festivalFocus": { $first: "$festivalFocus" },
                    "categorySearch": { $first: "$categorySearch" },
                    "pricingCategory": { $first: "$pricingCategory" },
                    "deadlines": { $first: "$deadlines" },
                    "eventVenue": { $first: "$eventVenue" },
                    "isSubmissionAddress": { $first: "$isSubmissionAddress" },
                    "eventOrganiser": { $first: "$eventOrganiser" },
                    "eventType": { $first: "$eventType" },
                    "eventName": { $first: "$eventName" },
                    "logo": { $first: "$logo" },
                    "yearsOfRunning": { $first: "$yearsOfRunning" },
                    "description": { $first: "$description" },
                    "awardsAndPrices": { $first: "$awardsAndPrices" },
                    "rulesAndTerms": { $first: "$rulesAndTerms" },
                    "keyStats": { $first: "$keyStats" },
                    "userId": { $first: "$userId" },
                    "createdAt": { $first: "$createdAt" },
                    "updatedAt": { $first: "$updatedAt" },
                    "address": { $first: "$address" },
                    "email": { $first: "$email" },
                    "phoneNumber": { $first: "$phoneNumber" },
                    "socialMediaLinks": { $first: "$socialMediaLinks" },
                    "website": { $first: "$website" },
                    "eventDate": { $first: "$eventDate" },
                    "notificationDate": { $first: "$notificationDate" },
                    "openingDate": { $first: "$openingDate" },
                    "currency": { $first: "$currency" },
                    "listingUrl": { $first: "$listingUrl" },
                    "runtime": { $first: "$runtime" },
                    "trackingSequence": { $first: "$trackingSequence" },
                    "photos": {
                        $addToSet: {
                            "_id": "$photos._id",
                            "status": "$photos.status",
                            "fileName": "$photos.fileName",
                            "mimeType": "$photos.mimeType",
                            "key": "$photos.key",
                            "userId": "$photos.userId",
                            "fileType": "$photos.fileType",
                            "createdAt": "$photos.createdAt",
                            "updatedAt": "$photos.updatedAt",
                            "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$photos.key"] },
                        }
                    },
                    "isOpen": { $first: "$isOpen" }
                }
            },
            {
                $lookup: {
                    from: "festivalfocus",
                    localField: "festivalFocus",
                    foreignField: "_id",
                    as: "festivalFocus"
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "logo",
                    foreignField: "_id",
                    as: "logo"
                }
            },
            {
                $unwind: {
                    path: '$logo',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "coverImg",
                    foreignField: "_id",
                    as: "coverImg"
                }
            },
            {
                $unwind: {
                    path: '$coverImg',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "eventtypes",
                    localField: "eventType",
                    foreignField: "_id",
                    as: "eventType"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categorySearch",
                    foreignField: "_id",
                    as: "categorySearch"
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
                $project: {
                    "_id": 1,
                    "status": 1,
                    "screenId": 1,
                    "listingVisibility": 1,
                    "allLengthAccepted": 1,
                    "searchTerms": 1,
                    "festivalFocus": 1,
                    "categorySearch": 1,
                    "pricingCategory": 1,
                    "deadlines": 1,
                    "eventVenue": 1,
                    "isSubmissionAddress": 1,
                    "eventOrganiser": 1,
                    "eventType": 1,
                    "eventName": 1,
                    "logo": {
                        "_id": "$logo._id",
                        "status": "$logo.status",
                        "fileName": "$logo.fileName",
                        "mimeType": "$logo.mimeType",
                        "key": "$logo.key",
                        "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$logo.key"] },
                        "userId": "$logo.userId",
                        "fileType": "$logo.fileType",
                        "createdAt": "$logo.createdAt",
                        "updatedAt": "$logo.updatedAt",
                    },
                    "coverImg": {
                        "_id": "$coverImg._id",
                        "status": "$coverImg.status",
                        "fileName": "$coverImg.fileName",
                        "mimeType": "$coverImg.mimeType",
                        "key": "$coverImg.key",
                        "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$coverImg.key"] },
                        "userId": "$coverImg.userId",
                        "fileType": "$coverImg.fileType",
                        "createdAt": "$coverImg.createdAt",
                        "updatedAt": "$coverImg.updatedAt",
                    },
                    "yearsOfRunning": 1,
                    "description": 1,
                    "awardsAndPrices": 1,
                    "rulesAndTerms": 1,
                    "keyStats": 1,
                    "userId": {
                        "_id": "$userId._id",
                        "isVerified": "$userId.isVerified",
                        "loginAttempts": "$userId.loginAttempts",
                        "role": "$userId.role",
                        "isFestivalManager": "$userId.isFestivalManager",
                        "firstName": "$userId.firstName",
                        "lastName": "$userId.lastName",
                        "email": "$userId.email",
                        "date": "$userId.date",
                        "lastLoggedIn": "$userId.lastLoggedIn"
                    },
                    "createdAt": 1,
                    "updatedAt": 1,
                    "address": 1,
                    "email": 1,
                    "phoneNumber": 1,
                    "socialMediaLinks": 1,
                    "website": 1,
                    "eventDate": 1,
                    "notificationDate": 1,
                    "openingDate": 1,
                    "currency": 1,
                    "listingUrl": 1,
                    "runtime": 1,
                    "trackingSequence": 1,
                    "photos": 1,
                    "isOpen": 1
                }
            }
        ]);

        return festival ? festival[0] : {};;
    };

    async addPhotos(data: AddPhotoDto, userId: string) {
        const event = await this.getSingleEvent(data.festivalId, userId);
        if (!event) throw new NotFoundException('Festival Not found');
        let arr = [].concat(event.photos);
        arr.push(data.photo);
        let lObj = {
            photos: arr
        };
        Object.assign(event, lObj);
        return event.save()
    };

    async removePhotos(data: AddPhotoDto, userId: string) {
        const event = await this.getSingleEvent(data.festivalId, userId);
        if (!event) throw new NotFoundException('Festival Not found');
        event.photos = event.photos.filter(v => {
            if (v.toString() != data.photo.toString()) return v;
        });
        return event.save()
    };

    async updateEventStatus(id: string, data: Partial<UpdateStatusDto>) {
        const event = await this.findOneUpdate(id, data);
        return event;
    };

    async browseFestival(query: any, pageNo: any) {

        let gIntDataPerPage = (query.offset == 0 || !query.offset) ? 12 : parseInt(query.offset)

        //Pagination
        let page = pageNo.page || 1;
        let skipRec = page - 1;
        skipRec = skipRec * gIntDataPerPage;

        let limit = Number(query.limit);
        let pageLimit;
        if (limit) {
            pageLimit = limit;
        } else {
            pageLimit = gIntDataPerPage;
        }

        const Festivals = await this.festivalModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "photos",
                    foreignField: "_id",
                    as: "photos"
                }
            },
            {
                $unwind: {
                    path: '$photos',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $group: {
                    _id: "$_id",
                    "status": { $first: "$status" },
                    "screenId": { $first: "$screenId" },
                    "listingVisibility": { $first: "$listingVisibility" },
                    "allLengthAccepted": { $first: "$allLengthAccepted" },
                    "searchTerms": { $first: "$searchTerms" },
                    "festivalFocus": { $first: "$festivalFocus" },
                    "categorySearch": { $first: "$categorySearch" },
                    "pricingCategory": { $first: "$pricingCategory" },
                    "deadlines": { $first: "$deadlines" },
                    "eventVenue": { $first: "$eventVenue" },
                    "isSubmissionAddress": { $first: "$isSubmissionAddress" },
                    "eventOrganiser": { $first: "$eventOrganiser" },
                    "eventType": { $first: "$eventType" },
                    "eventName": { $first: "$eventName" },
                    "logo": { $first: "$logo" },
                    "yearsOfRunning": { $first: "$yearsOfRunning" },
                    "description": { $first: "$description" },
                    "awardsAndPrices": { $first: "$awardsAndPrices" },
                    "rulesAndTerms": { $first: "$rulesAndTerms" },
                    "keyStats": { $first: "$keyStats" },
                    "userId": { $first: "$userId" },
                    "createdAt": { $first: "$createdAt" },
                    "updatedAt": { $first: "$updatedAt" },
                    "address": { $first: "$address" },
                    "email": { $first: "$email" },
                    "phoneNumber": { $first: "$phoneNumber" },
                    "socialMediaLinks": { $first: "$socialMediaLinks" },
                    "website": { $first: "$website" },
                    "eventDate": { $first: "$eventDate" },
                    "notificationDate": { $first: "$notificationDate" },
                    "openingDate": { $first: "$openingDate" },
                    "currency": { $first: "$currency" },
                    "listingUrl": { $first: "$listingUrl" },
                    "runtime": { $first: "$runtime" },
                    "trackingSequence": { $first: "$trackingSequence" },
                    "photos": {
                        $addToSet: {
                            "_id": "$photos._id",
                            "status": "$photos.status",
                            "fileName": "$photos.fileName",
                            "mimeType": "$photos.mimeType",
                            "key": "$photos.key",
                            "userId": "$photos.userId",
                            "fileType": "$photos.fileType",
                            "createdAt": "$photos.createdAt",
                            "updatedAt": "$photos.updatedAt",
                            "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$photos.key"] },
                        }
                    },
                    "isOpen": { $first: "$isOpen" }
                }
            },
            {
                $lookup: {
                    from: "festivalfocus",
                    localField: "festivalFocus",
                    foreignField: "_id",
                    as: "festivalFocus"
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "logo",
                    foreignField: "_id",
                    as: "logo"
                }
            },
            {
                $unwind: {
                    path: '$logo',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "coverImg",
                    foreignField: "_id",
                    as: "coverImg"
                }
            },
            {
                $unwind: {
                    path: '$coverImg',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "eventtypes",
                    localField: "eventType",
                    foreignField: "_id",
                    as: "eventType"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categorySearch",
                    foreignField: "_id",
                    as: "categorySearch"
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
                $project: {
                    "_id": 1,
                    "status": 1,
                    "screenId": 1,
                    "listingVisibility": 1,
                    "allLengthAccepted": 1,
                    "searchTerms": 1,
                    "festivalFocus": 1,
                    "categorySearch": 1,
                    "pricingCategory": 1,
                    "deadlines": 1,
                    "eventVenue": 1,
                    "isSubmissionAddress": 1,
                    "eventOrganiser": 1,
                    "eventType": 1,
                    "eventName": 1,
                    "logo": {
                        "_id": "$logo._id",
                        "status": "$logo.status",
                        "fileName": "$logo.fileName",
                        "mimeType": "$logo.mimeType",
                        "key": "$logo.key",
                        "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$logo.key"] },
                        "userId": "$logo.userId",
                        "fileType": "$logo.fileType",
                        "createdAt": "$logo.createdAt",
                        "updatedAt": "$logo.updatedAt",
                    },
                    "coverImg": {
                        "_id": "$coverImg._id",
                        "status": "$coverImg.status",
                        "fileName": "$coverImg.fileName",
                        "mimeType": "$coverImg.mimeType",
                        "key": "$coverImg.key",
                        "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$coverImg.key"] },
                        "userId": "$coverImg.userId",
                        "fileType": "$coverImg.fileType",
                        "createdAt": "$coverImg.createdAt",
                        "updatedAt": "$coverImg.updatedAt",
                    },
                    "yearsOfRunning": 1,
                    "description": 1,
                    "awardsAndPrices": 1,
                    "rulesAndTerms": 1,
                    "keyStats": 1,
                    "userId": {
                        "_id": "$userId._id",
                        "isVerified": "$userId.isVerified",
                        "loginAttempts": "$userId.loginAttempts",
                        "role": "$userId.role",
                        "isFestivalManager": "$userId.isFestivalManager",
                        "firstName": "$userId.firstName",
                        "lastName": "$userId.lastName",
                        "email": "$userId.email",
                        "date": "$userId.date",
                        "lastLoggedIn": "$userId.lastLoggedIn"
                    },
                    "createdAt": 1,
                    "updatedAt": 1,
                    "address": 1,
                    "email": 1,
                    "phoneNumber": 1,
                    "socialMediaLinks": 1,
                    "website": 1,
                    "eventDate": 1,
                    "notificationDate": 1,
                    "openingDate": 1,
                    "currency": 1,
                    "listingUrl": 1,
                    "runtime": 1,
                    "trackingSequence": 1,
                    "photos": 1,
                    "isOpen": 1
                }
            },
            {
                $match: {
                    "eventDate.fromDate": {
                        $gt: new Date(),
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skipRec },
            { $limit: pageLimit }
        ]);

        return {
            items: Festivals,
            total: Math.round(Festivals.length / (limit ? limit : gIntDataPerPage)),
            totalFestivals: await this.festivalModel.countDocuments(query),
            per_page: limit ? limit : gIntDataPerPage,
            currentPage: page
        };
    };
}
