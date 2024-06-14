import { Controller, Post, Get, Body, Req, Res, UseGuards, Query, Param, Delete, Patch, Put } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/Guards/auth.guard'
import { ResponseHandler } from 'src/utils/response.handler';
import { CallsheetdayService } from './callsheetday.service';
import { Model, Types } from 'mongoose';
import * as ejs from 'ejs';
import * as jsreport from 'jsreport';
let jsReportInitialized = false;
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { S3FileUpload } from 'src/utils/s3';
import JsReportService from 'src/utils/jsreport.service';
import { AddSignFontDto } from 'src/contract/dtos/add-sign-font.dto';

@Controller('callsheet/days')
export class CallsheetdayController {
    private jsReportService: JsReportService
    constructor(
        private response: ResponseHandler,
        private daySheet: CallsheetdayService,
        private config: ConfigService,
        private s3: S3FileUpload,
    ) {
        this.jsReportService = JsReportService.getInstance();
    };

    @Get()
    @UseGuards(AuthGuard)
    async getAllDays(@Req() req: Request, @Res() res: Response, @Query() query: any) {
        try {
            const { dayId = null, callSheetId } = query;

            let searchQuery = {
                status: 1,
                callSheetId: Types.ObjectId(callSheetId),
                $or: [
                    { "userId": req.user._id, },
                    { "projectTeamMembers.createdBy": req.user._id },
                    { "projectTeamMembers.projectTeamMember.email": req.user.email },
                    { "individualInvites.inviteInfo.email": req.user.email },
                    { "individualInvites.createdBy": req.user._id },
                ]
            }

            if (dayId) {
                searchQuery["_id"] = Types.ObjectId(dayId)
            }

            const daySheets = await this.daySheet.findAllCallSheetDay(searchQuery)

            return this.response.success(res, daySheets, "Day sheets fetched successfully");
        }
        catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/delete')
    @UseGuards(AuthGuard)
    async removeDay(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { dayId } = body;

            let searchQuery = {
                status: 1,
                userId: req.user._id,
                _id: Types.ObjectId(dayId)
            }

            this.daySheet.deleteOne(searchQuery).then(data => {
                return this.response.success(res, data, "Callsheet day removed successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/create')
    @UseGuards(AuthGuard)
    async createSheet(@Req() req: Request, @Res() res: Response, @Query() query: any) {
        try {
            const { dayId } = query;

            let searchQuery = {
                status: 1,
                userId: req.user._id,
                _id: Types.ObjectId(dayId)
            };

            let findDay = await this.daySheet.findOne(searchQuery);

            if (findDay) {
                findDay.callSheetCreated = true;
                await findDay.save();
                this.daySheet.createInfo({ userId: req.user._id, dayId: Types.ObjectId(dayId) }).then(data => {
                    return this.response.success(res, data, "Sheet created for the particular day.")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });

            } else {
                return this.response.error(res, 400, "Day not found. Please try again later")
            }
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Put('/createDay')
    @UseGuards(AuthGuard)
    async createDay(@Req() req: Request, @Res() res: Response, @Query() query: any, @Body() body: any) {
        try {
            const payload = {
                callSheetDay: body.callSheetDay,
                name: body.name,
                dayOff: body.dayOff,
                callSheetId: Types.ObjectId(body.callSheetId),
                userId: Types.ObjectId(body.userId),
            };

            const result = await this.daySheet.insertMultiple([payload])

            this.response.success(res, result, "Day added successfully!");

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }

    @Post('/copy')
    @UseGuards(AuthGuard)
    async copySheet(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { oldDayId, dayId } = body;

            let searchQuery = {
                status: 1,
                userId: req.user._id,
                _id: Types.ObjectId(oldDayId)
            };

            let findPreviousDay = await this.daySheet.findOne(searchQuery);
            let findDay = await this.daySheet.findOne({
                status: 1,
                userId: req.user._id,
                _id: Types.ObjectId(dayId)
            });

            if (findPreviousDay == null || findDay == null) {
                return this.response.error(res, 400, "Day not found. Please try again later")
            };

            let oldInfo = await this.daySheet.findOneInfo({
                status: 1,
                userId: req.user._id,
                dayId: Types.ObjectId(oldDayId)
            });

            if (oldInfo == null) {
                return this.response.error(res, 400, "There is no information to copy from previous sheet");
            };

            const { shootTiming, breakfast, firstMeal, secondMeal, location, extras, generalNotes, departmentNotes, productionReminders, layout, casts, weather, medic, miscellaneous, scenes, contacts } = oldInfo;

            let dayInfo = {
                dayId: Types.ObjectId(dayId),
                userId: req.user._id,
                shootTiming, breakfast, firstMeal, secondMeal, location, extras, generalNotes, departmentNotes, productionReminders, layout, casts, weather, medic, miscellaneous, scenes, contacts
            };

            this.daySheet.createInfo(dayInfo).then(async data => {
                findDay.callSheetCreated = true;
                await findDay.save();
                return this.response.success(res, data, "Previous sheet has been successfully copied.")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/delete/sheet')
    @UseGuards(AuthGuard)
    async deleteSheet(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { dayId } = body;

            let searchQuery = {
                status: 1,
                userId: req.user._id,
                _id: Types.ObjectId(dayId)
            };

            let findDay = await this.daySheet.findOne(searchQuery);

            if (findDay) {
                findDay.callSheetCreated = false;
                await findDay.save();
                this.daySheet.deleteOneInfo({ userId: req.user._id, dayId: Types.ObjectId(dayId) }).then(data => {
                    return this.response.success(res, data, "Sheet has been removed for the particular day.")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });

            } else {
                return this.response.error(res, 400, "Day not found. Please try again later")
            }
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/fetch')
    @UseGuards(AuthGuard)
    async getSheetData(@Req() req: Request, @Res() res: Response, @Query() query: any) {
        try {
            const { dayId } = query;

            let findSheet = await this.daySheet.getAllInfoByDayId(req.user, dayId);

            if (findSheet) {
                return this.response.success(res, findSheet, "Sheet has been updated, please try again later")
            } else {
                return this.response.error(res, 400, "Sheet not found for the particular date. Please try again later")
            }
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/update')
    @UseGuards(AuthGuard)
    async updateSheetData(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { dayId, shootTiming, breakfast, firstMeal, secondMeal, location, extras, generalNotes, departmentNotes, productionReminders, layout, casts, weather, medic, miscellaneous, scenes, contacts, isSectionVisible, usefulContacts } = body;

            let searchQuery = {
                status: 1,
                dayId: Types.ObjectId(dayId)
            };
            const foundSheet = await this.daySheet.findOneInfo(searchQuery);

            let dataWithProjectTeamMembers = await this.daySheet.findOneInfoWithTeamMembers(req.user, dayId);
            if (dataWithProjectTeamMembers[0]) {
                if (shootTiming) { foundSheet.shootTiming = shootTiming };
                if (breakfast) { foundSheet.breakfast = breakfast };
                if (firstMeal) { foundSheet.firstMeal = firstMeal };
                if (secondMeal) { foundSheet.secondMeal = secondMeal };
                if (location) {
                    foundSheet["location"] = {
                        productionOffice: Types.ObjectId(location?.productionOffice),
                        nearestHospital: Types.ObjectId(location?.nearestHospital),
                        parking: Types.ObjectId(location?.parking),
                        basecamp: Types.ObjectId(location?.basecamp),
                    }
                };

                if (extras) { foundSheet["extras"] = extras };
                if (generalNotes) { foundSheet["generalNotes"] = generalNotes }
                if (departmentNotes) { foundSheet["departmentNotes"] = departmentNotes }
                if (productionReminders) { foundSheet["productionReminders"] = productionReminders }
                if (layout) { foundSheet["layout"] = layout };
                if (casts) { foundSheet["casts"] = casts };
                if (weather) { foundSheet["weather"] = weather };
                if (medic) { foundSheet["medic"] = medic };
                if (miscellaneous) { foundSheet["miscellaneous"] = miscellaneous };
                if (scenes) { foundSheet["scenes"] = scenes };
                if (contacts) {
                    foundSheet["contacts"] = {
                        producer: Types.ObjectId(contacts?.producer),
                        co_producer: Types.ObjectId(contacts?.co_producer),
                        segment_producer: Types.ObjectId(contacts?.segment_producer),
                        line_producer: Types.ObjectId(contacts?.line_producer),
                        director: Types.ObjectId(contacts?.director),
                        assistant_director: Types.ObjectId(contacts?.assistant_director),
                        screen_writer: Types.ObjectId(contacts?.screen_writer),
                    }
                };
                if (usefulContacts) {
                    foundSheet["usefulContacts"] = usefulContacts;
                    console.log("found:", foundSheet);
                }
                if (isSectionVisible) {
                    foundSheet["isSectionVisible"] = isSectionVisible;
                }

                await foundSheet.save();

                return this.response.success(res, dataWithProjectTeamMembers[0], "Sheet has been updated")
            } else {
                return this.response.error(res, 400, "Sheet not found for the particular date. Please try again later")
            }
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };


    @Get('/export')
    @UseGuards(AuthGuard)
    async exportCallsheet(@Req() req: Request, @Res() res: Response, @Query() query: any) {
        try {
            const { dayId } = query;

            if (dayId == null) {
                return this.response.error(res, 400, 'Please provide the callsheet day to export')
            }

            let findSheet = await this.daySheet.getAllInfoByDayId(req.user, dayId);

            if (findSheet && Object.keys(findSheet).length == 0) {
                return this.response.error(res, 400, "Sheet not found for the particular date. Please try again later")
            }

            findSheet["casts"] = findSheet["casts"].map(item => {
                item["pickupTime"] = item?.pickupTime ? moment(item?.pickupTime).format("hh:mm A") : '-';
                item["arrivalTime"] = item?.arrivalTime ? moment(item?.arrivalTime).format("hh:mm A") : '-';
                item["blkTime"] = item?.blkTime ? moment(item?.blkTime).format("hh:mm A") : '-';
                item["wardTime"] = item?.wardTime ? moment(item?.wardTime).format("hh:mm A") : '-';
                item["setTime"] = item?.setTime ? moment(item?.setTime).format("hh:mm A") : '-';

                return item
            })

            findSheet["extras"] = findSheet["extras"].map(item => {
                item["arrivalTime"] = moment(item?.arrivalTime).format("hh:mm A");
                item["setTime"] = moment(item?.setTime).format("hh:mm A");

                return item
            })

            var content = fs.readFileSync(path.join(__dirname, '../../../public/templates/pdf-layout.ejs'), 'utf8');
            const html = ejs.render(content, {
                title: findSheet?.layout?.title,
                logo: findSheet?.layout?.key ? await this.s3.s3GetSignedURL(findSheet?.layout?.key) : null,
                userName: findSheet?.userId?.firstName + ' ' + findSheet?.userId?.lastName,
                base_url: this.config.get('BASE_URL'),
                shootTiming: {
                    "callTime": moment(findSheet?.shootTiming?.callTime).format("hh:mm A"),
                    "shootTime": moment(findSheet?.shootTiming?.shootTime).format("hh:mm A"),
                    "wrapTime": moment(findSheet?.shootTiming?.wrapTime).format("hh:mm A"),
                },
                breakfast: {
                    "startTime": moment(findSheet?.breakfast?.startTime).format("hh:mm A"),
                    "duration": findSheet?.breakfast?.duration,
                    "count": findSheet?.breakfast?.count
                },
                firstMeal: {
                    "startTime": moment(findSheet?.firstMeal?.startTime).format("hh:mm A"),
                    "duration": findSheet?.firstMeal?.duration,
                    "count": findSheet?.firstMeal?.count
                },
                secondMeal: {
                    "startTime": moment(findSheet?.secondMeal?.startTime).format("hh:mm A"),
                    "duration": findSheet?.secondMeal?.duration,
                    "count": findSheet?.secondMeal?.count
                },
                location: findSheet?.location,
                miscellaneous: findSheet?.miscellaneous,
                medic: findSheet?.medic,
                scenes: findSheet?.scenes,
                casts: findSheet?.casts,
                contacts: findSheet?.contacts,
                weather: {
                    "lowTemp": findSheet?.weather?.lowTemp,
                    "highTemp": findSheet?.weather?.highTemp,
                    "sunrise": moment(findSheet?.weather?.sunrise).format("hh:mm A"),
                    "sunset": moment(findSheet?.weather?.sunset).format("hh:mm A"),
                    "summary": findSheet?.weather?.summary
                },
                productionReminders: findSheet?.productionReminders,
                generalNotes: findSheet?.generalNotes,
                departmentNotes: findSheet?.departmentNotes,
                extras: findSheet?.extras,
                currentDay: findSheet?.days?.findIndex(item => item?._id == dayId) + 1,
                totalDays: findSheet?.days?.length,
                sheetDay: moment(findSheet?.dayId?.callSheetDay).format("dddd, MMMM DD, YYYY"),
                isSectionVisible: findSheet?.isSectionVisible ? findSheet.isSectionVisible : {
                    todaysSchedule: true,
                    cast: true,
                    extras: true,
                    departmentNotes: true,
                    additionalNotes: true,
                    usefulContacts: true,
                    productionTitle: true,
                    logo: true,
                }
            });


            this.jsReportService.render({
                template: {
                    content: html,
                    engine: 'handlebars',
                    recipe: 'chrome-pdf'
                }
            }).then((out) => {
                let callsheetName = `callsheet-${Date.now()}.pdf`;
                let pdfPath = path.join(__dirname, `../../../public/${callsheetName}`)
                var output = fs.createWriteStream(pdfPath)
                out.stream.pipe(output);
                out.stream.on('end', () => {
                    let filepathfromResponse = pdfPath
                    let lastParam = filepathfromResponse.split('/')
                    let filepath = { path: `${this.config.get('BASE_URL')}templates/${callsheetName}` };
                    return this.response.success(res, filepath, 'Callsheet exported successfully')
                })
            }).catch((e) => {
                return this.response.forbiddenError(res, 'Something went wrong. Please try again.')
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

}
