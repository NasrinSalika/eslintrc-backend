import { Controller, Post, Get, Body, Req, Res, Query, UseInterceptors, UploadedFile, UseGuards, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { EventTypeService } from './event-type.service';
import { CreateEventtDto } from './dtos/create-event.dto';
import { ResponseHandler } from '../utils/response.handler';
import { CreateFocusDto } from './dtos/create-focus.dto';
import { FestivalFocusService } from './festival-focus.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/Guards/auth.guard';
import { S3FileUpload } from 'src/utils/s3';
import { FestivalService } from './festival.service';
import { UploadFileDto } from './dtos/upload-file.dto';
import { CreateEventDetailsDto } from './dtos/create-eventdetails.dto';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { CreateEventDateDto } from './dtos/create-eventdate.dto';
import * as moment from 'moment'
import { CreateEventFeesDto } from './dtos/create-fees.dto';
import { CreateEventSettingsDto } from './dtos/create-additional-setting.dto';
import { AddPhotoDto } from './dtos/add-photos.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { Types } from "mongoose";
import { RoleGuard } from 'src/Guards/role.guard';
@Controller('festival')
export class FestivalController {
    constructor(
        private event: EventTypeService,
        private response: ResponseHandler,
        private focus: FestivalFocusService,
        private category: CategoryService,
        private s3Upload: S3FileUpload,
        private festival: FestivalService
    ) { };

    @Post('/add-event')
    async addEvents(@Body() body: CreateEventtDto, @Req() req: Request, @Res() res: Response) {
        try {
            let ifEventExsist = await this.event.findOne({
                eventName: body.eventName,
                status: 1
            });

            if (ifEventExsist) {
                return this.response.error(res, 400, "Event already exsist")
            }

            this.event.createEvent(body).then(data => {
                return this.response.success(res, data, "Event added succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/all-events')
    async getAllEvents(@Req() req: Request, @Res() res: Response) {
        try {
            this.event.findAll().then(data => {
                return this.response.success(res, data, "Event fetched succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }

    @Post('/add-focus')
    async addFestivalFocus(@Body() body: CreateFocusDto, @Req() req: Request, @Res() res: Response) {
        try {
            let ifFocusExsist = await this.focus.findOne({
                focusName: body.focusName,
                status: 1
            });

            if (ifFocusExsist) {
                return this.response.error(res, 400, "Festival focus already exsist")
            }

            this.focus.createFocus(body).then(data => {
                return this.response.success(res, data, "Festival focus added succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/all-focus')
    async getAllFestivalFocus(@Req() req: Request, @Res() res: Response) {
        try {
            this.focus.findAll().then(data => {
                return this.response.success(res, data, "Festival focus fetched succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }

    /** Category Api start  */
    @Post('/add-category')
    async addCategory(@Body() body: CreateCategoryDto, @Req() req: Request, @Res() res: Response) {
        try {
            let ifFocusExsist = await this.category.findOne({
                events: { $in: body.events },
                categoryName: body.categoryName,
                status: 1
            });

            if (ifFocusExsist) {
                return this.response.error(res, 400, "Festival focus already exsist")
            };

            ifFocusExsist = await this.category.findOne({
                categoryName: body.categoryName,
                status: 1
            });

            if (ifFocusExsist) {
                let lObj = {
                    _id: ifFocusExsist._id,
                    categoryName: ifFocusExsist.categoryName,
                    events: [...ifFocusExsist.events, body.events]
                };

                this.category.findOneAndUpdate(lObj).then(data => {
                    return this.response.success(res, data, "Festival focus added succesfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            } else {
                this.category.createCategory(body).then(data => {
                    return this.response.success(res, data, "Festival focus added succesfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/all-category')
    async getAllCategory(@Req() req: Request, @Res() res: Response, @Query('id') id: string) {
        try {
            let q = {};
            if (id) q["id"] = id;
            this.category.findAll(q).then(data => {
                return this.response.success(res, data, "Festival focus fetched succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }

    @Get('/all-countires')
    async getAllCountry(@Req() req: Request, @Res() res: Response) {
        try {
            this.focus.getAll().then(data => {
                return this.response.success(res, data, "Countires fetched succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/all-currency')
    async getAllCurrency(@Req() req: Request, @Res() res: Response) {
        try {
            this.focus.getAllCurrency().then(data => {
                return this.response.success(res, data, "Currency fetched succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/file-upload')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadMedia(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response, @Body() body: UploadFileDto) {
        try {
            this.s3Upload.uploadFileToS3(file).then((data: any) => {
                let lObj = {
                    fileName: data.fileName,
                    mimeType: data.mimeType,
                    key: data.key,
                    userId: req.user._id,
                    fileType: body.fileType
                };

                this.festival.storeFile(lObj).then(data => {
                    return this.response.success(res, data, `${body.fileType} has uploaded succesfully`)
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Get('/browse')
    async browseFestivals(@Req() req: Request, @Res() res: Response, @Query() query) {
        try {
            let queryArr = ['entryOpen', 'eventType', 'category', 'years', 'runtime', "focus", "country", "deadline", "eventDate", "q"];

            let searchQuery = {
                "status": 1
            }, ids;

            queryArr.forEach(async (key) => {
                if (query[key] && query[key] !== '' && query[key] !== '\'\'') {
                    switch (key) {
                        case 'q':
                            searchQuery["$or"] = [
                                { "eventName": { $regex: query.q, $options: 'i' } },
                                { "searchTerms": { $regex: query.q, $options: 'i' } },
                                { "eventVenue.country"  : { $regex: query.q, $options: 'i' } },
                                { "eventVenue.state"  : { $regex: query.q, $options: 'i' } }
                            ]
                            break;
                        case 'entryOpen':
                            if ((query.entryOpen).toLowerCase() === 'true') searchQuery["isOpen"] = (query.entryOpen).toLowerCase() === 'true'; break;
                        case 'eventType':
                            ids = JSON.parse(query.eventType);
                            ids = ids.map(v => Types.ObjectId(v))
                            searchQuery["eventType"] = { $in: ids }
                            break;
                        case 'category':
                            ids = JSON.parse(query.category);
                            ids = ids.map(v => Types.ObjectId(v))
                            searchQuery["categorySearch"] = { $in: ids }
                            break;
                        case 'focus':
                            ids = JSON.parse(query.focus);
                            ids = ids.map(v => Types.ObjectId(v))
                            searchQuery["festivalFocus"] = { $in: ids }
                            break;
                        case 'country':
                            searchQuery["eventVenue.country"] = query.country
                            break;
                        case 'years':
                            let yrs = JSON.parse(query.years);
                            if (yrs.min == yrs.max) searchQuery["yearsOfRunning"] = { $gte: yrs.max };
                            else searchQuery["yearsOfRunning"] = { $gte: yrs.min, $lte: yrs.max };
                            break;
                        case 'runtime':
                            let time = parseInt(query.runtime);
                            searchQuery["runtime.maxMin"] = {
                                $gte: time
                            };
                            break;
                        case 'deadline':
                            let deadline = moment(query.deadline).utc().format();
                            searchQuery["deadlines.date"] = {
                                $gte: new Date(deadline)
                            };
                            break;
                        case 'eventDate':
                            let eventDate = moment(query.deadline).utc().format();
                            searchQuery["eventDate.fromDate"] = {
                                $gte: new Date(eventDate)
                            };
                            break;
                    }
                }
            });

            this.festival.browseFestival(searchQuery, { page: query.page }).then(data => {
                return this.response.success(res, data, `Festival List`)
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }

    @Get('/filters')
    async getAllFilters(@Req() req: Request, @Res() res: Response) {
        try {

            let filterObj = {};

            filterObj["eventType"] = await this.event.findAll();
            filterObj["country"] = await this.focus.getAll();
            filterObj["category"] = await this.category.findAll();
            filterObj["focus"] = await this.focus.findAll();
            
            return this.response.success(res, filterObj, `Filter List`)
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }

    @Post('/event-details')
    @UseGuards(AuthGuard)
    async addEventDetails(@Req() req: Request, @Res() res: Response, @Body() body: CreateEventDetailsDto) {
        try {
            let requestBody = { ...body };
            requestBody["userId"] = req.user._id;

            if (body && body.hasOwnProperty("_id")) {
                let { _id, ...rest } = requestBody
                this.festival.updateEventDetails(_id, rest).then(data => {
                    return this.response.success(res, data, "Event Details updated successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            } else {
                this.festival.addEventDetails(requestBody).then(data => {
                    return this.response.success(res, data, "Event Details added successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/event-venue')
    @UseGuards(AuthGuard)
    async addVenueDetails(@Req() req: Request, @Res() res: Response, @Body() body: CreateVenueDto) {
        try {
            let requestBody = { ...body };
            requestBody["userId"] = req.user._id;

            let { _id, ...rest } = requestBody
            this.festival.updateVenueDetails(_id, rest).then(data => {
                return this.response.success(res, data, "Venue Details added successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/event-dates')
    @UseGuards(AuthGuard)
    async addEventDates(@Req() req: Request, @Res() res: Response, @Body() body: CreateEventDateDto) {
        try {

            let openingDate = body.openingDate,
                firstDeadline = body.deadlines[0].date,
                notificationDate = body.notificationDate,
                lastDeadline = body.deadlines[body.deadlines.length - 1].date,
                eventDate = body.eventDate.fromDate;

            if (!moment(firstDeadline).isAfter(openingDate)) {
                return this.response.error(res, 400, 'Deadline must greater than opening date')
            };

            if (!moment(notificationDate).isAfter(lastDeadline)) {
                return this.response.error(res, 400, 'Notifcation must greater than deadline')
            };

            if (!moment(eventDate).isAfter(notificationDate)) {
                return this.response.error(res, 400, 'EventDate must greater than Notification Date')
            };

            let lCreateObj = {
                _id: body._id,
                openingDate: new Date(body.openingDate),
                notificationDate: new Date(body.notificationDate),
                eventDate: {
                    fromDate: new Date(body.eventDate.fromDate),
                    toDate: new Date(body.eventDate.toDate),
                },
                deadlines: body.deadlines.map((deadline) => {
                    deadline.date =  new Date(deadline.date);
                    return deadline;
                }),
                screenId: body.screenId
            };

            let requestBody = { ...lCreateObj };
            requestBody["userId"] = req.user._id;

            let { _id, ...rest } = requestBody
            this.festival.updateEventDates(_id, rest).then(data => {
                return this.response.success(res, data, "Event Dates added successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/event-fees')
    @UseGuards(AuthGuard)
    async addEventFees(@Req() req: Request, @Res() res: Response, @Body() body: CreateEventFeesDto) {
        try {

            let requestBody = { ...body };
            requestBody["userId"] = req.user._id;

            let { _id, ...rest } = requestBody
            this.festival.updateEventFees(_id, rest).then(data => {
                return this.response.success(res, data, "Event Fees added successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/event-setting')
    @UseGuards(AuthGuard)
    async addEventSetting(@Req() req: Request, @Res() res: Response, @Body() body: CreateEventSettingsDto) {
        try {

            let requestBody = { ...body };
            requestBody["userId"] = req.user._id;

            let { _id, ...rest } = requestBody
            this.festival.updateEventSetting(_id, rest).then(data => {
                return this.response.success(res, data, "Event Settings added successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Get()
    @UseGuards(AuthGuard)
    async getAllFestivals(@Req() req: Request, @Res() res: Response) {
        try {
            this.festival.getFestivals(req.user._id).then(data => {
                return this.response.success(res, data, "Festival list has been fetched successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Get('/:id')
    @UseGuards(AuthGuard)
    async getFestivalInfoById(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            this.festival.getFestivalById(id, req.user._id).then(data => {
                return this.response.success(res, data, "Festival has been fetched successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    }

    @Post('/add-photos')
    @UseGuards(AuthGuard)
    async addPhotosToFestival(@Req() req: Request, @Res() res: Response, @Body() body: AddPhotoDto) {
        try {
            this.festival.addPhotos(body, req.user._id).then(data => {
                return this.response.success(res, data, "Photo has been uploaded successfully")
            }).catch(err => {
                console.log(err);
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            console.log(err);
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/remove-photos')
    @UseGuards(AuthGuard)
    async removePhotosToFestival(@Req() req: Request, @Res() res: Response, @Body() body: AddPhotoDto) {
        try {
            this.festival.removePhotos(body, req.user._id).then(data => {
                return this.response.success(res, data, "Photo has been removed successfully")
            }).catch(err => {
                console.log(err);
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            console.log(err);
            return this.response.errorInternal(err, res)
        }
    }

    @Post('/status')
    @UseGuards(AuthGuard)
    async updateFestivalStatus(@Req() req: Request, @Res() res: Response, @Body() body: UpdateStatusDto) {
        try {
            let requestBody = { ...body };
            requestBody["userId"] = req.user._id;

            let { festivalId, ...rest } = requestBody

            this.festival.updateEventStatus(festivalId, rest).then(data => {
                return this.response.success(res, data, "Festival status updated successfully")
            }).catch(err => {
                console.log(err);
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            console.log(err);
            return this.response.errorInternal(err, res)
        }
    };
}
