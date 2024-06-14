import { Controller, Post, Get, Body, Req, Res, UseGuards, Query, Param, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateProjectTypeDto } from './dtos/create-project-type.dto';
import { ResponseHandler } from '../utils/response.handler';
import { ProjectTypeService } from './project-type.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CreateProjectInfoDto } from './dtos/create-project-info.dto';
import { FestivalProjectsService } from './festival-projects.service';
import { AddContactInfoDto } from './dtos/contact-info.dto';
import { AddCreditsDto } from './dtos/credits.dto';
import { CreateProjectCategoryDto } from './dtos/create-category.dto';
import { AddSpecificationDto } from './dtos/add-specification.dto';
import { AddMediaDto } from './dtos/add-media.dto';

@Controller('projects')
export class FestivalProjectsController {
    constructor(
        private type: ProjectTypeService,
        private response: ResponseHandler,
        private project: FestivalProjectsService
    ) { };

    @Post('/add-type')
    async addTypes(@Body() body: CreateProjectTypeDto, @Req() req: Request, @Res() res: Response) {
        try {
            let ifEventExsist = await this.type.findOne({
                name: body.name,
                status: 1
            });

            if (ifEventExsist) {
                return this.response.error(res, 400, "Type already exsist")
            }

            this.type.createProjectType(body).then(data => {
                return this.response.success(res, data, "Type added succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/all-type')
    async getAllTypess(@Req() req: Request, @Res() res: Response) {
        try {
            this.type.findAll().then(data => {
                return this.response.success(res, data, "Type fetched succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/add-category')
    async addProjectCategory(@Body() body: CreateProjectCategoryDto, @Req() req: Request, @Res() res: Response) {
        try {
            let ifFocusExsist = await this.type.findOneCategory({
                types: { $in: body.types },
                categoryName: body.categoryName,
                status: 1
            });

            if (ifFocusExsist) {
                return this.response.error(res, 400, "Festival focus already exsist")
            };

            ifFocusExsist = await this.type.findOneCategory({
                categoryName: body.categoryName,
                status: 1
            });

            if (ifFocusExsist) {
                let lObj = {
                    _id: ifFocusExsist._id,
                    categoryName: ifFocusExsist.categoryName,
                    types: [...ifFocusExsist.types, body.types]
                };

                this.type.findOneAndUpdate(lObj).then(data => {
                    return this.response.success(res, data, "Category added succesfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            } else {
                this.type.createCategory(body).then(data => {
                    return this.response.success(res, data, "Category added succesfully")
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
            this.type.findAllCategory(q).then(data => {
                return this.response.success(res, data, "Category fetched succesfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }

    @Post('/add-info')
    @UseGuards(AuthGuard)
    async addProjectInfo(@Req() req: Request, @Res() res: Response, @Body() body: CreateProjectInfoDto) {
        try {
            let requestBody = { ...body };
            requestBody["userId"] = req.user._id;

            if (body && body.hasOwnProperty("_id")) {
                let { _id, ...rest } = requestBody;
                
                this.project.updateProjectInfo(_id, rest).then(data => {
                    return this.response.success(res, data, "Project Info updated successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            } else {
                let ifEventExsist = await this.project.findOne({ projectTitle: body.projectTitle, status: 1, userId: req.user._id });

                if (ifEventExsist) {
                    return this.response.error(res, 400, "Project already exsist")
                }

                this.project.createProjectInformation(requestBody).then(data => {
                    return this.response.success(res, data, "Project Info added successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/add-contact')
    @UseGuards(AuthGuard)
    async addContactInfo(@Req() req: Request, @Res() res: Response, @Body() body: AddContactInfoDto) {
        try {
            let requestBody = { ...body };
            requestBody["userId"] = req.user._id;

            let { _id, ...rest } = requestBody
            this.project.addContactInfo(_id, rest).then(data => {
                return this.response.success(res, data, "Contact Info added successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/add-credits')
    @UseGuards(AuthGuard)
    async addCredits(@Req() req: Request, @Res() res: Response, @Body() body: AddCreditsDto) {
        try {
            let requestBody = { ...body };
            requestBody["userId"] = req.user._id;

            let { _id, ...rest } = requestBody
            this.project.addCreditsToProject(_id, rest).then(data => {
                return this.response.success(res, data, "Credits added successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/add-specification')
    @UseGuards(AuthGuard)
    async addSpecification(@Req() req: Request, @Res() res: Response, @Body() body: AddSpecificationDto) {
        try {
            let requestBody = { ...body };
            requestBody["userId"] = req.user._id;

            let { _id, ...rest } = requestBody
            this.project.addSpecificationToProject(_id, rest).then(data => {
                return this.response.success(res, data, "Specification added successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Get()
    @UseGuards(AuthGuard)
    async getAllUserProject(@Req() req: Request, @Res() res: Response, @Query() query) {
        try {

            this.project.getProjectList({ id: req.user._id, page: query.page }).then(data => {
                return this.response.success(res, data, "Project List")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Get('/:id')
    @UseGuards(AuthGuard)
    async getSingleProject(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        try {
            this.project.viewProject(id, req.user._id).then(data => {
                return this.response.success(res, data, "Project List")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/remove/:id')
    @UseGuards(AuthGuard)
    async removeProject(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        try {
            this.project.removeProject(id, req.user._id).then(data => {
                return this.response.success(res, '', "Removed project successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/add-media')
    @UseGuards(AuthGuard)
    async addPhotosToFestival(@Req() req: Request, @Res() res: Response, @Body() body: AddMediaDto) {
        try {
            this.project.addMedia(body, req.user._id).then(data => {
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
}


