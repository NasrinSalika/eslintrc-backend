import { Controller, Post, Get, Body, Req, Res, UseGuards, Query, Param, Delete, Patch } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/Guards/auth.guard'
import { ResponseHandler } from 'src/utils/response.handler';
import { Model, Types } from 'mongoose';
import { CallsheetService } from './callsheet.service';
import * as moment from 'moment';
import { CallsheetdayService } from './callsheetday/callsheetday.service';

@Controller('callsheet')
export class CallsheetController {
    constructor(
        private response: ResponseHandler,
        private callsheet: CallsheetService,
        private daySheet: CallsheetdayService
    ) { };

    @Post('/create')
    @UseGuards(AuthGuard)
    async createCallSheet(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { name, startDate, endDate, workingDays, projectId } = body;

            let findSheet = await this.callsheet.findOne({ name, userId: req.user._id, status: 1, projectId });

            if (findSheet) {
                return this.response.error(res, 400, 'Callsheet with same name exsist')
            };

            this.callsheet.create({
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                workingDays,
                projectId,
                userId: req.user._id
            }).then(data => {
                let dateDiff = moment(new Date(endDate)).diff(moment(new Date(startDate)), "days");

                let days = []
                for (let i = 0; i <= dateDiff; i++) {
                    let date = moment(startDate).add(i, 'days')
                    days.push({
                        name: moment(date).format('ddd, MMM DD'),
                        callSheetDay: new Date(date.toDate()),
                        callSheetId: data?._id,
                        userId: req.user._id,
                        dayOff: !workingDays.includes(moment(date).format('ddd'))
                    })
                }
                this.daySheet.insertMultiple(days)
                return this.response.success(res, data, "Callsheet created successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };


    //new endpoint with invitation logic
    @Get()
    @UseGuards(AuthGuard)
    async getAllCallSheet(@Req() req: Request, @Res() res: Response, @Query() query: any) {
        try {
            const { sheetId , projectId } = query;

            let callsheets;
            if (req.query.projectId!=="null") {
                callsheets = await this.callsheet.getAllCallSheetWithProjectTeamMembers(req.user, projectId);
            } else if (req.query.sheetId) {
                callsheets = await this.callsheet.getAllCallSheetBySheetId(req.user, sheetId);
            } else {
                return this.response.error(res,400,"Both projectId and sheetId are missing");
            }

            return this.response.success(res, callsheets, "Callsheets fetched successfully");
        } catch (e) {
            return this.response.errorInternal(e, res);
        }
    }

    @Patch('/update/:sheetId')
    @UseGuards(AuthGuard)
    async updateCallSheet(@Req() req: Request, @Res() res: Response, @Body() body: any, @Param() param: any) {
        try {
            let { sheetId } = param, { name, startDate, endDate, workingDays } = body;

            let findSheet = await this.callsheet.findOne({ _id: Types.ObjectId(sheetId), userId: req.user._id, status: 1 });

            if (!findSheet) {
                return this.response.error(res, 400, 'Callsheet does not exsist')
            }

            startDate = new Date(startDate);
            endDate = new Date(endDate);

            findSheet["name"] = name;
            findSheet["startDate"] = startDate;
            findSheet["endDate"] = endDate;
            findSheet["workingDays"] = workingDays;

            await findSheet.save();

            return this.response.success(res, findSheet, 'Callsheet updated successfully')

        } catch (err) {
            console.log(err)
            return this.response.errorInternal(err, res)
        }
    }

    @Post('remove')
    @UseGuards(AuthGuard)
    async deleteCallSheet(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { deleteIds } = body;

            let searchQuery = {
                _id: { $in: deleteIds },
                status: 1,
                userId: req.user._id
            }

            this.callsheet.removeSheet(searchQuery).then(data => {
                this.daySheet.deleteMany({ callSheetId: { $in: deleteIds.map(item => Types.ObjectId(item)) }, status: 1, userId: req.user._id })
                return this.response.success(res, '', "Callsheets removed successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };
}
