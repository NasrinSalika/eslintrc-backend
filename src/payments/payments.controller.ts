import { Controller, Post, Get, Body, Req, Res, Query, UseInterceptors, UploadedFile, UseGuards, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseHandler } from '../utils/response.handler';
import { AuthGuard } from 'src/Guards/auth.guard';
import { StripeService } from 'src/utils/stripe.service';
import { AddCardDto } from './dtos/add-card.dto';
import { CreatePayDto } from './dtos/create-pay.dto';
import { PaymentsService } from './payments.service';
import { CapturePaymentDto } from './dtos/capture-payment.dto';
import { FestivalSubmissionService } from 'src/festival-submission/festival-submission.service';
import * as moment from 'moment'

@Controller('payments')
export class PaymentsController {
    constructor(
        private response: ResponseHandler,
        private stripe: StripeService,
        private payment: PaymentsService,
        private submission: FestivalSubmissionService
    ) { };

    @Post('/update-info')
    @UseGuards(AuthGuard)
    updateInfo(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            if (req.user && !('stripeCustId' in req.user)) {
                this.response.notAuthorized(res, 'User role is only allowed')
            };

            this.stripe.updateCustomer(req.user.stripeCustId, {
                shipping: {
                    address: {
                        city: 'Tirunelveli',
                        country: 'CA',
                        line1: '51, Kaja Nayagam street Melaplayam',
                        postal_code: "627005",
                        state: 'CA'
                    },
                    name: req.user.firstName + " " + req.user.lastName
                }
            }).then(response => {
                return this.response.success(res, response, "Customer updated successfully")
            }).catch(err => {
                return this.response.error(res, 400, err.raw.message)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/update-card')
    @UseGuards(AuthGuard)
    updateCard(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            if (req.user && !('stripeCustId' in req.user)) {
                this.response.notAuthorized(res, 'User role is only allowed')
            };

            this.stripe.updatePaymentSource(req.user.stripeCustId, req.body.cardId, {
                address_city: 'Tirunelveli',
                address_country: 'IN',
                address_line1: '51, Kaja Nayagam street Melaplayam',
                address_zip: "627005",
                address_state: 'TamilNadu',
                name: req.user.firstName + ' ' + req.user.lastName
            }).then(response => {
                return this.response.success(res, response, "Customer updated successfully")
            }).catch(err => {
                return this.response.error(res, 400, err.raw.message)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    }

    @Get('/user-cards')
    @UseGuards(AuthGuard)
    getUserCards(@Req() req: Request, @Res() res: Response) {
        try {

            if (req.user && !('stripeCustId' in req.user)) {
                this.response.notAuthorized(res, 'User role is only allowed')
            };

            this.stripe.getAllCards(req.user.stripeCustId).then(response => {
                const { data } = response
                return this.response.success(res, data, "User card's")
            }).catch(err => {
                return this.response.error(res, 400, err.raw.message)
            });
        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/add-card')
    @UseGuards(AuthGuard)
    createCard(@Req() req: Request, @Res() res: Response, @Body() body: AddCardDto) {
        try {
            if (req.user && !('stripeCustId' in req.user)) {
                this.response.notAuthorized(res, 'User role is only allowed')
            };

            const { number, exp_month, exp_year, cvc, name } = body;

            this.stripe.createToken({ number, exp_month, exp_year, cvc, name }).then(response => {
                this.stripe.createPaymentSource(req.user.stripeCustId, response.id).then(response => {
                    return this.response.success(res, response, "Card added successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err.raw.message)
                })
            }).catch(err => {
                return this.response.error(res, 400, err.raw.message)
            })

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    }

    @Post('/add-charge')
    @UseGuards(AuthGuard)
    async createPay(@Req() req: Request, @Res() res: Response, @Body() body: CreatePayDto) {
        try {

            if (req.user && !('stripeCustId' in req.user)) {
                this.response.notAuthorized(res, 'User role is only allowed')
            };

            const { cartId, total, payment_source } = body;

            let ifCartExsist = await this.submission.getCartById(cartId, req.user._id);

            if (ifCartExsist == null) {
                return this.response.error(res, 400, 'Cart does not exsist')
            };

            let bookingId = "FFC-" + Date.now();

            this.stripe.getCustomerDetails(req.user.stripeCustId).then(stripeRes => {
                this.payment.createPayment({ cartId, total }, req.user._id, bookingId).then(async resp => {
                    this.stripe.createCharge({
                        amount: Math.round(total * 100),
                        currency: 'usd',
                        source: payment_source,
                        customer: req.user.stripeCustId,
                        metadata: {
                            "transaction_id": resp._id.toString()
                        },
                        receipt_email: req.user.email,
                        description: 'Film Festival payment ' + Date.now(),
                        capture: false,
                        shipping: {
                            address: {
                                line1: stripeRes.shipping.address.line1,
                                postal_code: stripeRes.shipping.address.postal_code,
                                city: stripeRes.shipping.address.city,
                                state: 'San Fransico',
                                country: 'CA',
                            },
                            name: req.user.firstName + ' ' + req.user.lastName
                        }
                    }).then(resObj => {

                        this.payment.findOneUpdate(resp._id, {
                            paymentId: resObj.id,
                            paymentObject: resObj,
                            paymentStatus: 'in-progress'
                        }, req.user._id).then(datObj => {
                            return this.response.success(res, { stripeRes: resObj, payment: datObj }, "Charge Created")
                        }).catch(err => {
                            return this.response.error(res, 400, err)
                        });

                    }).catch(err => {
                        return this.response.error(res, 400, err.raw.message)
                    });

                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }).catch(err => {
                return this.response.error(res, 400, err.raw.message)
            })

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/capture')
    @UseGuards(AuthGuard)
    async capturePayment(@Req() req: Request, @Res() res: Response, @Body() body: CapturePaymentDto) {
        try {

            if (req.user && !('stripeCustId' in req.user)) {
                this.response.notAuthorized(res, 'User role is only allowed')
            };

            const { paymentId, stripePaymentId } = body;

            let ifPaymentExist = await this.payment.getPayments(paymentId, req.user._id);

            if (ifPaymentExist == null) {
                return this.response.error(res, 400, 'Payment does not exsist')
            }

            this.stripe.capturePayment(stripePaymentId).then(stripeRes => {
                this.payment.findOneUpdate(paymentId, {
                    paymentStatus: stripeRes.status
                }, req.user._id).then(async (datObj: any) => {
                    await this.submission.updateCartAfterPayment(datObj.cartId.toString(), { status: 2, paymentStatus: stripeRes.status }, req.user._id);

                    if (stripeRes.status == 'succeeded') {
              
                        let ifCartExsist: any = await this.submission.getCartAfterPaymentStatus(datObj.cartId, req.user._id);

                        if (ifCartExsist == null) return this.response.error(res, 400, 'Cart does not exsist');

                        for (let item of ifCartExsist.cartItems) {

                            let lSubmissionObj = {
                                "projectId": item.projectId,
                                "festivalId": item.festivalId,
                                "category": item,
                                "amount_paid": item.price,
                                "userId": req.user._id,
                                "submissionPaymentId":  paymentId
                            };

                            this.submission.createSumissionToFestival(lSubmissionObj).then(async (resp: any) => {

                            }).catch(err => {
                                return this.response.error(res, 400, err)
                            });
                        }
                    };

                    return this.response.success(res, { stripeRes, payment: datObj }, "Capture payment")
                }).catch(err => {
                    if (err && "message" in err) {
                        return this.response.error(res, 400, err.message);
                    } else {
                        return this.response.error(res, 400, err)
                    }
                });
            }).catch(err => {
                return this.response.error(res, 400, err.raw.message)
            })

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/refund-pay')
    @UseGuards(AuthGuard)
    async createRefundPayment(@Req() req: Request, @Res() res: Response, @Body() body: CapturePaymentDto) {
        try {

            if (req.user && !('stripeCustId' in req.user)) {
                this.response.notAuthorized(res, 'User role is only allowed')
            };

            const { paymentId, stripePaymentId } = body;

            let ifPaymentExist = await this.payment.getPayments(paymentId, req.user._id);

            if (ifPaymentExist == null) {
                return this.response.error(res, 400, 'Payment does not exsist')
            }

            this.stripe.capturePayment(stripePaymentId).then(stripeRes => {
                this.payment.findOneUpdate(paymentId, {
                    paymentStatus: stripeRes.status
                }, req.user._id).then(async datObj => {
                    await this.submission.updateCartAfterPayment(datObj.cartId.toString(), { status: 2, paymentStatus: stripeRes.status }, req.user._id)
                    return this.response.success(res, { stripeRes, payment: datObj }, "Capture payment")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }).catch(err => {
                return this.response.error(res, 400, err.raw.message)
            })

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/add-payment')
    @UseGuards(AuthGuard)
    createPayment(@Req() req: Request, @Res() res: Response, @Body() body: CreatePayDto) {
        try {

            if (req.user && !('stripeCustId' in req.user)) {
                this.response.notAuthorized(res, 'User role is only allowed')
            };

            const { cartId, total, payment_source } = body;

            let ifCartExsist = this.submission.getCartById(cartId, req.user._id);

            if (ifCartExsist == null) {
                return this.response.error(res, 400, 'Cart does not exsist')
            };

            let bookingId = "FFC-" + Date.now();

            this.stripe.getCustomerDetails(req.user.stripeCustId).then(stripeRes => {
                this.payment.createPayment({ cartId, total }, req.user._id, bookingId).then(async resp => {
                    this.stripe.createIntent({
                        amount: Math.round(total * 100),
                        currency: 'usd',
                        payment_method: payment_source,
                        payment_method_types: ['card'],
                        customer: req.user.stripeCustId,
                        metadata: {
                            "transaction_id": resp._id.toString()
                        },
                        receipt_email: req.user.email,
                        description: 'Film Festival payment ' + Date.now(),
                        capture_method: "manual"
                    }).then(resObj => {

                        this.payment.findOneUpdate(resp._id, {
                            paymentId: resObj.id,
                            paymentObject: resObj,
                            paymentStatus: 'in-progress'
                        }, req.user._id).then(datObj => {
                            return this.response.success(res, { stripeRes: resObj, payment: datObj }, "Payment Intent Created")
                        }).catch(err => {
                            return this.response.error(res, 400, err)
                        });

                    }).catch(err => {
                        return this.response.error(res, 400, err.raw.message)
                    });

                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }).catch(err => {
                return this.response.error(res, 400, err.raw.message)
            })

        } catch (err) {
            return this.response.errorInternal(err, res)
        }
    };

    @Post('/capture-intent')
    @UseGuards(AuthGuard)
    async capturePaymentIntent(@Req() req: Request, @Res() res: Response, @Body() body: CapturePaymentDto) {
        try {

            if (req.user && !('stripeCustId' in req.user)) {
                this.response.notAuthorized(res, 'User role is only allowed')
            };

            const { paymentId, stripePaymentId } = body;

            let ifPaymentExist = await this.payment.getPayments(paymentId, req.user._id);

            if (ifPaymentExist == null) {
                return this.response.error(res, 400, 'Payment does not exsist')
            }

            let confirmIntent = await this.stripe.confirmIntent(stripePaymentId);

            this.stripe.captureIntent(stripePaymentId).then(stripeRes => {
                this.payment.findOneUpdate(paymentId, {
                    paymentStatus: stripeRes.status
                }, req.user._id).then(async datObj => {
                    await this.submission.updateCartAfterPayment(datObj.cartId.toString(), { status: 2, paymentStatus: stripeRes.status }, req.user._id)
                    return this.response.success(res, { stripeRes, payment: datObj }, "Capture payment")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }).catch(err => {
                return this.response.error(res, 400, err.raw.message)
            })

        } catch (err) {
            console.log(err)
            return this.response.errorInternal(err, res)
        }
    };
}
