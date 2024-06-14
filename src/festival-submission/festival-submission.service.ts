import { Injectable, NotFoundException } from '@nestjs/common';
import { AddStatusTypeDto } from './dtos/add-status.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StatusTypes, StatusTypesDocument } from './model/status.schema';
import { Festivals, FestivalsDocument } from '../festival/models/festival.schema';
import { ConfigService } from '@nestjs/config';
import { CartDocument, Carts } from './model/cart.schema';
import { FestivalSubmission, SubmissionDocument } from './model/submission.schema';
import { CreateSubmissionDto } from './dtos/create-submission.dto';

@Injectable()
export class FestivalSubmissionService {
    constructor(
        @InjectModel(StatusTypes.name) private statusModel: Model<StatusTypesDocument>,
        @InjectModel(Festivals.name) private festivalModel: Model<FestivalsDocument>,
        @InjectModel(Carts.name) private cartModel: Model<CartDocument>,
        @InjectModel(FestivalSubmission.name) private submissionModel: Model<SubmissionDocument>,
        private config: ConfigService
    ) { }

    async addStatusType(data: AddStatusTypeDto) {
        const status = new this.statusModel(data);
        return await status.save();
    };

    async findAllStatus() {
        return this.statusModel.find({ status: 1 }).lean();
    };

    async findByFestivalId(data: any) {
        const festival = await this.festivalModel.aggregate([
            {
                $match: data
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

        return festival ? festival[0] : {};
    };

    async getPricesByFestivalId(id: string) {
        if (!id) return null;
        return this.festivalModel.findOne({ _id: Types.ObjectId(id), status: 1 }).exec();
    };

    async addToCart(data: any) {
        const cart = new this.cartModel(data);
        return await cart.save();
    };

    async getCart(userId: string) {
        return this.cartModel.findOne({
            userId: Types.ObjectId(userId),
            status: 1
        }).exec();
    };

    async findOneUpdate(id: string, data: any) {
        const cart = await this.getCart(id);
        if (!cart) throw new NotFoundException('cart Not found');
        Object.assign(cart, data);
        return cart.save()
    }

    async updateCart(id: string, data: Partial<any>) {
        const cart = await this.findOneUpdate(id, data);
        return cart;
    };

    async getCartById(id: string, userId: string) {
        return this.cartModel.findOne({ _id: Types.ObjectId(id), userId: Types.ObjectId(userId), status: 1 })
    };

    async updateCartAfterPayment(id: string, data: any, userId: string) {
        const cart = await this.getCartById(id, userId);
        if (!cart) throw new NotFoundException('cart Not found');
        Object.assign(cart, data);
        return cart.save()
    };

    async getCartAfterPaymentStatus(id: string, userId: string) {
        return this.cartModel.findOne({ _id: Types.ObjectId(id), userId: Types.ObjectId(userId), status: 2 })
    };

    async createSumissionToFestival(data: CreateSubmissionDto) {
        const submission = new this.submissionModel(data);
        return await submission.save();
    };

    async getSubmissionByFestivalOrUser(data: any, pageNo: any) {
        let gIntDataPerPage = 12;

        let page = pageNo.page || 1;
        let skipRec = page - 1;
        skipRec = skipRec * gIntDataPerPage;

        let pageLimit = gIntDataPerPage;

        const Submissions = await this.submissionModel.aggregate([
            {
                $lookup: {
                    from: "payments",
                    localField: "submissionPaymentId",
                    foreignField: "_id",
                    as: "paymentInfo"
                }
            },
            {
                $unwind: {
                    path: '$paymentInfo',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "statustypes",
                    localField: "submission_status",
                    foreignField: "_id",
                    as: "submission_status"
                }
            },
            {
                $unwind: {
                    path: '$submission_status',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "statustypes",
                    localField: "judging_status",
                    foreignField: "_id",
                    as: "judging_status"
                }
            },
            {
                $unwind: {
                    path: '$judging_status',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "festivals",
                    localField: "festivalId",
                    foreignField: "_id",
                    as: "festivalId"
                }
            },
            {
                $unwind: {
                    path: '$festivalId',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $match: data
            },
            {
                $lookup: {
                    from: "festivalfocus",
                    localField: "ffestivalId.estivalFocus",
                    foreignField: "_id",
                    as: "festivalId.festivalFocus"
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "festivalId.logo",
                    foreignField: "_id",
                    as: "festivalId.logo"
                }
            },
            {
                $unwind: {
                    path: '$festivalId.logo',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "festivalId.coverImg",
                    foreignField: "_id",
                    as: "festivalId.coverImg"
                }
            },
            {
                $unwind: {
                    path: '$festivalId.coverImg',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "eventtypes",
                    localField: "festivalId.eventType",
                    foreignField: "_id",
                    as: "festivalId.eventType"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "festivalId.categorySearch",
                    foreignField: "_id",
                    as: "festivalId.categorySearch"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "festivalId.userId",
                    foreignField: "_id",
                    as: "festivalId.userId"
                }
            },
            {
                $unwind: {
                    path: '$festivalId.userId',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "festivalprojects",
                    localField: "projectId",
                    foreignField: "_id",
                    as: "projectId"
                }
            },
            {
                $unwind: {
                    path: '$projectId',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "projecttypes",
                    localField: "projectId.projectType",
                    foreignField: "_id",
                    as: "projectId.projectType"
                }
            },
            {
                $unwind: {
                    path: '$projectId.projectType',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "festivalprojectcategories",
                    localField: "projectId.projectCategory",
                    foreignField: "_id",
                    as: "projectId.projectCategory"
                }
            },
            {
                $lookup: {
                    from: "festivalfiles",
                    localField: "projectId.media",
                    foreignField: "_id",
                    as: "projectId.media"
                }
            },
            {
                $unwind: {
                    path: '$projectId.media',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "projectId.userId",
                    foreignField: "_id",
                    as: "projectId.userId"
                }
            },
            {
                $unwind: {
                    path: '$projectId.userId',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $project: {
                    "_id": 1,
                    "status": 1,
                    "judging_status": 1,
                    "submission_status": 1,
                    "paymentInfo": 1,
                    "projectId": {
                        "_id": "$projectId._id",
                        "status": "$projectId.status",
                        "screenId": "$projectId.screenId",
                        "isAnotherLanguageTitle": "$projectId.isAnotherLanguageTitle",
                        "projectType": "$projectId.projectType",
                        "projectTitle": "$projectId.projectTitle",
                        "description": "$projectId.description",
                        "userId": {
                            "_id": "$projectId.userId._id",
                            "isVerified": "$projectId.userId.isVerified",
                            "loginAttempts": "$projectId.userId.loginAttempts",
                            "role": "$projectId.userId.role",
                            "isFestivalManager": "$projectId.userId.isFestivalManager",
                            "firstName": "$projectId.userId.firstName",
                            "lastName": "$projectId.userId.lastName",
                            "company": "$projectId.userId.company",
                            "email": "$projectId.userId.email",
                            "date": "$projectId.userId.date",
                            "lastLoggedIn": "$projectId.userId.lastLoggedIn"
                        },
                        "createdAt": "$projectId.createdAt",
                        "updatedAt": "$projectId.updatedAt",
                        "address": "$projectId.address",
                        "birthDate": "$projectId.birthDate",
                        "category": "$projectId.category",
                        "director": "$projectId.director",
                        "distributionInfo": "$projectId.distributionInfo",
                        "email": "$projectId.email",
                        "gender": "$projectId.gender",
                        "keyCasts": "$projectId.keyCasts",
                        "languages": "$projectId.languages",
                        "phoneNumber": "$projectId.phoneNumber",
                        "producers":"$projectId.producers",
                        "screeningAndAwards": "$projectId.screeningAndAwards",
                        "writers": "$projectId.writers",
                        "awardsWon": "$projectId.awardsWon",
                        "projectCategory": "$projectId.projectCategory",
                        "genres": "$projectId.genres",
                        "budget": "$projectId.budget",
                        "completionDate": "$projectId.completionDate",
                        "countryOfOrigin": "$projectId.countryOfOrigin",
                        "runtime": "$projectId.runtime",
                        "aspectRatio": "$projectId.aspectRatio",
                        "countryOfFilming": "$projectId.countryOfFilming",
                        "filmColour": "$projectId.filmColour",
                        "firstTimeFilmMaker": "$projectId.firstTimeFilmMaker",
                        "shootingFormat": "$projectId.shootingFormat",
                        "studentProject": "$projectId.studentProject",
                        "media": {
                            "_id": "$projectId.media._id",
                            "status": "$projectId.media.status",
                            "fileName": "$projectId.media.fileName",
                            "mimeType": "$projectId.media.mimeType",
                            "key": "$projectId.media.key",
                            "userId": "$projectId.media.userId",
                            "fileType": "$projectId.media.fileType",
                            "createdAt": "$projectId.media.createdAt",
                            "updatedAt": "$projectId.media.updatedAt",
                            "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$projectId.media.key"] },
                        }
                    },
                    "festivalId": {
                        "_id": "$festivalId._id",
                        "isApproved": "$festivalId.isApproved",
                        "status": "$festivalId.status",
                        "screenId": "$festivalId.screenId",
                        "isOpen": "$festivalId.isOpen",
                        "listingVisibility": "$festivalId.listingVisibility",
                        "allLengthAccepted": "$festivalId.allLengthAccepted",
                        "searchTerms": "$festivalId.searchTerms",
                        "festivalFocus": "$festivalId.festivalFocus",
                        "categorySearch": "$festivalId.categorySearch",
                        "pricingCategory": "$festivalId.pricingCategory",
                        "deadlines": "$festivalId.deadlines",
                        "eventVenue": "$festivalId.eventVenue",
                        "isSubmissionAddress": "$festivalId.isSubmissionAddress",
                        "phoneNumber": "$festivalId.phoneNumber",
                        "eventOrganiser": "$festivalId.eventOrganiser",
                        "photos": "$festivalId.photos",
                        "eventType": "$festivalId.eventType",
                        "eventName": "$festivalId.eventName",
                        "logo": {
                            "_id": "$festivalId.logo._id",
                            "status": "$festivalId.logo.status",
                            "fileName": "$festivalId.logo.fileName",
                            "mimeType": "$festivalId.logo.mimeType",
                            "key": "$festivalId.logo.key",
                            "userId": "$festivalId.logo.userId",
                            "fileType": "$festivalId.logo.fileType",
                            "createdAt": "$festivalId.logo.createdAt",
                            "updatedAt": "$festivalId.logo.updatedAt",
                            "url": { $concat: [`https://${this.config.get('AWS_S3_BUCKET')}.s3.amazonaws.com/`, "$festivalId.logo.key"] }
                        },
                        "yearsOfRunning": "$festivalId.yearsOfRunning",
                        "description": "$festivalId.description",
                        "awardsAndPrices": "$festivalId.awardsAndPrices",
                        "rulesAndTerms": "$festivalId.rulesAndTerms",
                        "keyStats": "$festivalId.keyStats",
                        "userId": {
                            "_id": "$festivalId.userId._id",
                            "isVerified": "$festivalId.userId.isVerified",
                            "loginAttempts": "$festivalId.userId.loginAttempts",
                            "role": "$festivalId.userId.role",
                            "isFestivalManager": "$festivalId.userId.isFestivalManager",
                            "firstName": "$festivalId.userId.firstName",
                            "lastName": "$festivalId.userId.lastName",
                            "company": "$festivalId.userId.company",
                            "email": "$festivalId.userId.email",
                            "date": "$festivalId.userId.date",
                            "lastLoggedIn": "$festivalId.userId.lastLoggedIn"
                        },
                        "createdAt": "$festivalId.createdAt",
                        "updatedAt": "$festivalId.updatedAt",
                        "address": "$festivalId.address",
                        "email": "$festivalId.email",
                        "website": "$festivalId.website",
                        "eventDate": "$festivalId.eventDate",
                        "notificationDate": "$festivalId.notificationDate",
                        "openingDate": "$festivalId.openingDate",
                        "currency": "$festivalId.currency",
                        "listingUrl": "$festivalId.listingUrl",
                        "runtime": "$festivalId.runtime",
                        "trackingSequence": "$festivalId.trackingSequence"
                    },
                    "category": 1,
                    "amount_paid": 1,
                    "userId": 1,
                    "createdAt": 1,
                    "updatedAt": 1
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skipRec },
            { $limit: pageLimit }
        ]);

        return {
            items: Submissions,
            total: Math.round(Submissions.length / gIntDataPerPage),
            totalSubmissions: await this.submissionModel.countDocuments(data),
            per_page: gIntDataPerPage,
            currentPage: page
        };

    }
}
