import { Controller, Post, Get, Body, Req, Res, Query, UseGuards, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { FestivalService } from 'src/festival/festival.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Mailer } from 'src/utils/mailService';
import { ResponseHandler } from 'src/utils/response.handler';
import { AdminDashboardService } from './admin-dashboard.service';
import { ApprovedDto } from './dtos/add-photos.dto';

@Controller('admin')
export class AdminDashboardController {
    constructor(
        private response: ResponseHandler,
        private admin: AdminDashboardService,
        private festival: FestivalService,
        private mail: Mailer
    ) { }

    @Get('/list')
    @UseGuards(AuthGuard, RoleGuard)
    async festivalList(@Req() req: Request, @Res() res: Response, @Query() query) {
        try {
            let searchQuery = {
                status: 1
            };

            if (query.type == 'approved') searchQuery["isApproved"] = true;
            else if (query.type == 'unapproved') searchQuery["isApproved"] = false;

            this.festival.browseFestival(searchQuery, { page: query.page }).then(data => {
                return this.response.success(res, data, "Festival List")
            }).catch(err => {
                return this.response.error(res, 400, err)
            })
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };


    @Post('/approve-festival')
    @UseGuards(AuthGuard, RoleGuard)
    async approveFestival(@Req() req: Request, @Res() res: Response, @Body() body: ApprovedDto) {
        try {
            let requestBody = { ...body };
            requestBody["approverId"] = req.user._id;

            let { festivalId, ...rest } = requestBody;
            this.festival.approveFestival(festivalId, rest).then(data => {
                return this.response.success(res, data, "Festival approved successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            })
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/count')
    @UseGuards(AuthGuard, RoleGuard)
    async getAllFestivalCount(@Req() req: Request, @Res() res: Response) {
        try {
            this.admin.getAllFestivalsCount().then(data => {
                let lOut = {};
                lOut["all_festival"] = data.length;
                lOut["approved_festival"] = (data.filter((item => item.isApproved))).length;
                lOut["unapproved_festival"] = (data.filter((item => !item.isApproved))).length;
                return this.response.success(res, lOut, "Dashboadr count")
            }).catch(err => {
                return this.response.error(res, 400, err)
            })
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/test-mail')
    async testMailMailgun(@Req() req: Request, @Res() res: Response) {
        try {
            this.mail.welcomeInvitation({
                email: 'firnaas@cineacloud.com',
                userName: "Firnaas"
            })
            return this.response.success(res, "", "Mail sent")
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }
}
