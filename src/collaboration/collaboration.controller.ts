import { Controller, Post, UseGuards, Req, Res, Body, Get, Query, Param } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { ResponseHandler } from 'src/utils/response.handler';
import { AuthGuard } from 'src/Guards/auth.guard';
import { UsersService } from 'src/users/users.service';
import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { PropsService } from 'src/props/props.service';
import { Mailer } from 'src/utils/mailService';
import { CallsheetService } from 'src/callsheet/callsheet.service';
import { EpkService } from 'src/epk/epk.service';

@Controller('collaboration')
export class CollaborationController {
    constructor(
        private response: ResponseHandler,
        private collab: CollaborationService,
        private user: UsersService,
        private props: PropsService,
        private mailer: Mailer,
        private callsheet: CallsheetService,
        private epk: EpkService
    ) { };

    @Post('/invite')
    @UseGuards(AuthGuard)
    async addIndividualInvite(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { addMembers, removeMembers, appId, type, projectId } = body;

            let appExsist = null;
            let appType= null
            let appName = null
            let checkForAccess = await this.user.getProjectById({
                _id: Types.ObjectId(projectId),
            });

            if (checkForAccess == null) {
                return this.response.error(res, 400, "You don't have access to invite members to the project");
            };

            switch (type) {
                case 'props':
                    appExsist = await this.props.findPropMember({ _id: Types.ObjectId(appId), status: 1 })
                    if(appExsist){
                        appType ="props"
                        appName= `${appExsist.item}`
                    }
                    if (appExsist == null) {
                        return this.response.error(res, 400, "Props don't exsist please check, please try again");
                    };

                    break;

                case 'epk':
                    appExsist = await this.epk.findEpkId({ status: 1, _id: Types.ObjectId(appId) })
                    if(appExsist){
                        appType ="epk"
                        appName= `${appExsist.epkName}`
                    }
                    if (appExsist == null) {
                        return this.response.error(res, 400, "Props don't exsist please check, please try again");
                    };

                    break;

                case 'callsheet':
                    appExsist = await this.callsheet.findCallsheetById({ _id: Types.ObjectId(appId), status: 1 })
                    if(appExsist){
                        appType ="call sheet"
                        appName= `${appExsist.name}`
                    }
                    if (appExsist == null) {
                        return this.response.error(res, 400, "Callsheet don't exsist please check, please try again");
                    };

                    break;
            };

            if (addMembers.length > 0) {
                for (let member of addMembers) {
                    if (member.email == req.user.email) {
                        return this.response.error(res, 400, 'You cant add yourself as members')
                    };

                    let checkMemberAlreadyExsist = await this.collab.checkMembers({
                        appId,
                        "inviteInfo.email": member.email,
                        createdBy: req.user._id,
                        status: 1
                    });

                    if (checkMemberAlreadyExsist) {
                        return this.response.error(res, 400, `${member.name} already added to the ${type}`)
                    };

                    await this.collab.inviteMembers({
                        appId,
                        inviteInfo: {
                            name: member.name || '',
                            email: member.email,
                            app: type
                        },
                        createdBy: Types.ObjectId(req.user._id)
                    });

                    const mailOptions = {
                        from: process.env.ADMIN_EMAIL,
                        to: member.email, // list of receivers
                        subject: `Cineacloud | Invite`, // Subject line
                        template: 'individual_invite',
                        'h:X-Mailgun-Variables': JSON.stringify({
                            "userName": `${member.name}`,
                            "app": `${appType}`,
                            "appName": `${appName}`,
                            "inviter_name": req.user.firstName,
                            "verifyLink": `${process.env.NODE_URL_1}/users/login`,
                            "function": "invited to"
                        })
                    };

                    await this.mailer.send(mailOptions)

                }

                let members = await this.collab.getMembersById({ appId: Types.ObjectId(appId), "inviteInfo.app": type, status: 1 }, type);

                return this.response.success(res, members, 'Memeber(s) have been invited successfully')
            }

            if (removeMembers.length > 0) {
                for (let member of removeMembers) {
                    let checkMemberAlreadyExsist = await this.collab.checkMembers({
                        appId,
                        "inviteInfo.email": member.email,
                        // createdBy: req.user._id, leave it for now in case of future problems
                        status: 1
                    });

                    if (checkMemberAlreadyExsist) {
                        await this.collab.removeMembers({
                            appId,
                            "inviteInfo.email": member.email,
                            // createdBy: req.user._id,   leave it for now in case of future problems
                            status: 1
                        });

                    };
                }

                let members = await this.collab.getMembersById({ appId: Types.ObjectId(appId), "inviteInfo.app": type, status: 1 }, type);

                return this.response.success(res, members, 'Memeber(s) have been removed successfully')
            }


        } catch (err) {
            console.log(err)
            return this.response.errorInternal(err, res)
        }
    };

    @Get('/invite/:id')
    @UseGuards(AuthGuard)
    async getInviteMembers(@Req() req: Request, @Res() res: Response, @Query() query: any, @Param() param: any) {
        try {
            const { id } = param,
                { type } = query;

            if (id == undefined) {
                return this.response.error(res, 400, "App Id is mandatory")
            };

            let searchObj = {
                appId: Types.ObjectId(id),
                "inviteInfo.app": type,
                status: 1
            };

            let ifAppExsist = null;

            switch (type) {
                case 'props':
                    ifAppExsist = await this.props.findPropMember({ status: 1, _id: Types.ObjectId(req.params.id) })
                    break;

                case 'epk':
                    ifAppExsist = await this.epk.findEpkId({ status: 1, _id: Types.ObjectId(req.params.id) })
                    break;

                case 'callsheet':
                    ifAppExsist = await this.callsheet.findCallsheetById({ _id: Types.ObjectId(req.params.id), status: 1 });
                    break;
                
            };

            if (ifAppExsist == null) {
                return this.response.error(res, 400, `${type} not found`)
            }

            this.collab.getMembersById(searchObj, type).then(async data => {
                data = [...data, ifAppExsist.userId]
                return this.response.success(res, data, `${type} members fetched successfully`)
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    }
}
