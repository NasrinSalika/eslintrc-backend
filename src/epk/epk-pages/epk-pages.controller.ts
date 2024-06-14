import { Controller, Post, Get, Body, Req, Res, UseGuards, Query, Param, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/Guards/auth.guard';
import { ResponseHandler } from 'src/utils/response.handler';
import { Model, Types } from 'mongoose';
import { EpkPagesService } from './epk-pages.service';
import { EpkService } from '../epk.service';
import { S3FileUpload } from 'src/utils/s3';

@Controller('epk-pages')
export class EpkPagesController {
    constructor(
        private response: ResponseHandler,
        private page: EpkPagesService,
        private epk: EpkService,
        private s3: S3FileUpload
    ) { };

    @Get("/:epkId")
    @UseGuards(AuthGuard)
    async getEpkById(@Req() req: Request, @Res() res: Response, @Param('epkId') epkId: string) {
        try {
    
            let pageData = await this.page.getPageWithTeamMembersByEpkId(epkId,req.user)

            if(!pageData){
                this.response.error(res,404,"not found")
            }
            
            return this.response.success(res,pageData,"Epk Fetched successfully")
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Delete("/:pageId")
    @UseGuards(AuthGuard)
    async deleteEpkTempById(@Req() req: Request, @Res() res: Response, @Param('pageId') pageId: string) {
        try {
            let ifTempExsist = await this.page.findOnePage({
                status: 1,
                _id: Types.ObjectId(pageId),
                userId: req.user._id
            });

            if (ifTempExsist == null) {
                return this.response.error(res, 400, "Page does'nt exsist, please try again");
            };

            this.page.removePage(Types.ObjectId(pageId), Types.ObjectId(req.user._id)).then(data => {
                return this.response.success(res, '', "Page deleted successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };


    @Post('/add')
    @UseGuards(AuthGuard)
    async addTemplatesToEpk(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            let ifepKExsist = await this.epk.findOneEpk({ _id: Types.ObjectId(req.body.epkId), status: 1 })

            let ownerId:Types.ObjectId = ifepKExsist.userId
        
            if (ifepKExsist == null) {
                return this.response.error(res, 400, "EpK does not exsist")
            };

            let matchQuery = {
                epkId: req.body.epkId,
                status: 1
            };

            if (req.body.pageId !== undefined) {
                matchQuery["_id"] = req.body.pageId;
            };

            let ifTemplateExsist = await this.page.findOnePage(matchQuery);

            if (ifTemplateExsist == null || req.body.pageId == undefined) {
                this.page.createPage({
                    // name: req.body.name,
                    objects: req.body.objects,
                    preview: req.body.image,
                    previewImg: req.body.previewImg,
                    epkId: Types.ObjectId(req.body.epkId),
                    userId: ownerId
                }).then(async data => {
                    return this.response.success(res, data, "Page created successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }

            if (ifTemplateExsist !== null && req.body.pageId !== undefined) {
                this.page.updatePage(req.body.epkId.toString(), {
                    // name: req.body.name,
                    objects: req.body.objects,
                    pageId: Types.ObjectId(req.body.pageId),
                    preview: req.body.image,
                    previewImg: req.body.previewImg,
                    userId: ownerId
                }).then(async data => {
                    return this.response.success(res, data, "Page updated successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };
}
