import { Controller, Post, Get, Body, Req, Res, Query, UseInterceptors, UploadedFile, UseGuards, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import * as moment from 'moment';
import { ResponseHandler } from '../utils/response.handler';
import { FestivalSubmissionService } from './festival-submission.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { AddStatusTypeDto } from './dtos/add-status.dto';
import { AddCheckoutDto } from './dtos/add-to-checkout.dto';
import { FestivalProjectsService } from 'src/festival-projects/festival-projects.service';
import { sortedLastIndexOf } from 'lodash';
import { Model, Types } from 'mongoose';
interface Deadlines {
    title: string
}

@Controller('submission')
export class FestivalSubmissionController {
    constructor(
        private response: ResponseHandler,
        private submission: FestivalSubmissionService,
        private projectService: FestivalProjectsService
    ) { };

    @Post('/add-status')
    addStstusFlags(@Req() req: Request, @Res() res: Response, @Body() body: AddStatusTypeDto) {
        try {
            this.submission.addStatusType(body).then(data => {
                return this.response.success(res, data, "Status has been added successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Get('/all-status')
    getAllStatus(@Req() req: Request, @Res() res: Response) {
        try {
            this.submission.findAllStatus().then(data => {
                return this.response.success(res, data, "Status fetched successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Get('/get-festival/:id')
    getFestival(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        try {
            this.submission.findByFestivalId({
                _id: Types.ObjectId(id),
                status: 1
            }).then(data => {
                return this.response.success(res, data, "Festival fetched successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    getDealine(deadlines) {
        let nearest, lastDiff;
        for (let deadline of deadlines) {
            let diff = moment(deadline?.date).diff(moment(), 'days');
            if ((lastDiff > diff || diff >= 0) && !isNaN(diff)) {
                lastDiff = diff;
                nearest = deadline;
                break;
            } else {
                lastDiff = diff;
                nearest = null;
            }
        };
        return nearest;
    };

    @Get('/get-prices/:id')
    getPrices(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        try {
            this.submission.getPricesByFestivalId(id).then((data: any) => {
                let currentDeadline = this.getDealine(data.deadlines);

                if (currentDeadline == null) return this.response.noAccess(res, 'Festival Deadline closed')

                let pricingCategory = data.pricingCategory, festivalName = data.eventName, festivalId = data._id;

                for (let x of pricingCategory) {
                    x.prices = x.prices.filter((prices: Deadlines) => {
                        return prices?.title.toLowerCase() == currentDeadline.title.toLowerCase()
                    });
                }

                return this.response.success(res, { pricingCategory, currentDeadline, festivalName, festivalId }, "Prices fetched successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/add-to-cart')
    @UseGuards(AuthGuard)
    async addToCheckout(@Req() req: Request, @Res() res: Response, @Body() body: AddCheckoutDto) {
        try {
            let { items = [] } = body;

            let lObjCreate = {}, cartItems = [];

            if (items.length < 0) {
                return this.response.error(res, 400, "Please select a category before proceeding.");
            };

            let ifCartExsist = await this.submission.getCart(req.user._id)

            for (let item of items) {
                let isProjectExsist = await this.projectService.getSingleProject(item.projectId, req.user._id);

                if (isProjectExsist == null) {
                    return this.response.error(res, 400, "Project does not exsist");
                };

                let isFestivalExsist = await this.submission.getPricesByFestivalId(item.festivalId);

                if (isFestivalExsist == null) {
                    return this.response.error(res, 400, "Festival does not exsist");
                };

                if (ifCartExsist && 'cartItems' in ifCartExsist && ifCartExsist.cartItems.length > 0) {
                    let ifAlreadyExsist = ifCartExsist.cartItems.some(el => item.projectId.toString() == el.projectId.toString() && item.categoryName == el.category && item.pricingName == el.deadline && isProjectExsist.projectTitle == el.projectName);

                    if (ifAlreadyExsist) {
                        return this.response.error(res, 400, 'Already item exsist in cart')
                    } else {
                        cartItems.push({
                            "projectName": isProjectExsist.projectTitle,
                            "category": item?.categoryName,
                            "deadline": item?.pricingName,
                            "price": parseFloat(item?.pricingAmt),
                            "projectId": isProjectExsist._id,
                            "festivalId": item?.festivalId
                        });
                    };
                } else {
                    cartItems.push({
                        "projectName": isProjectExsist.projectTitle,
                        "category": item?.categoryName,
                        "deadline": item?.pricingName,
                        "price": parseFloat(item?.pricingAmt),
                        "projectId": isProjectExsist._id,
                        "festivalId": item?.festivalId
                    });
                }
            }

            let total = items.reduce((sum, curr) => {
                return sum + parseFloat(curr.pricingAmt);
            }, 0);

            if (ifCartExsist) {
                let updateItems = [...ifCartExsist.cartItems, ...cartItems],
                    updateTotal = parseFloat(ifCartExsist.total) + Number(total);

                this.submission.updateCart(req.user._id, {
                    cartItems: updateItems,
                    total: updateTotal
                }).then(data => {
                    return this.response.success(res, data, "Added to cart")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            } else {
                lObjCreate["cartItems"] = cartItems;
                lObjCreate["total"] = total;
                lObjCreate["userId"] = req.user._id;

                this.submission.addToCart(lObjCreate).then(data => {
                    return this.response.success(res, data, "Added to cart")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Get('/cart')
    @UseGuards(AuthGuard)
    async getCart(@Req() req: Request, @Res() res: Response) {
        try {
            this.submission.getCart(req.user._id).then(data => {
                return this.response.success(res, data, "Cart fetched successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/remove-cart/:id')
    @UseGuards(AuthGuard)
    async removeCartItem(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        try {
            this.submission.getCart(req.user._id).then(data => {
                let result = data;

                let item = result.cartItems.filter(el => {
                    return el._id.toString() == id.toString();
                });

                let newTotal = parseFloat(data.total) - parseFloat(item[0].price);

                Object.assign(data, {
                    cartItems: result.cartItems.filter(el => {
                        return el._id.toString() !== id.toString();
                    }),
                    total: newTotal
                });

                data.save();

                return this.response.success(res, data, "Cart Item successfully removed")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Get('/list')
    @UseGuards(AuthGuard)
    async getSubmission(@Req() req: Request, @Res() res: Response, @Query() query) {
        try {
            const user = req.user;
            let page = req.query.page || 1;

            let searchQuery = {
                status: 1
            };

            if (user.isFestivalManager) {
                if (req.query.festivalId == undefined) {
                    return this.response.error(res, 400, 'Festival Id is mandatory, Please try refreshing your page')
                };

                let ifFestivalExsist = await this.submission.findByFestivalId({
                    _id: Types.ObjectId(req.query.festivalId.toString()),
                    status: 1,
                    userId: req.user._id
                });

                if (ifFestivalExsist == null) {
                    return this.response.error(res, 400, 'Festival does not exsist')
                };

                searchQuery["festivalId.userId"] = user._id;
                searchQuery["festivalId._id"] = Types.ObjectId(req.query.festivalId.toString());

                this.submission.getSubmissionByFestivalOrUser(searchQuery, { page }).then(data => {
                    return this.response.success(res, data, "Festival Submission")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });

            } else {
                searchQuery["userId"] = user._id;

                this.submission.getSubmissionByFestivalOrUser(searchQuery, { page }).then(data => {
                    return this.response.success(res, data, "Festival Submission")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            };
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };
}
