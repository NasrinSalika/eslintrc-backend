import { Controller, Post, Get, Body, Req, Res, Query, UseInterceptors, UseGuards, Param, Put } from '@nestjs/common';
import { Request, Response, query } from 'express';
import { ResponseHandler } from 'src/utils/response.handler';
import { AuthGuard } from 'src/Guards/auth.guard';
import { SignersService } from './signers.service';
import { InviteSignersDto } from '../dtos/invite-signers.dto';
import { Types } from 'mongoose';
import { AddSignFontDto } from '../dtos/add-sign-font.dto';
import { AddDrawSignDto } from '../dtos/add-draw-sign.dto';
import { EnableSingleUserDto } from '../dtos/enable-signer.dto';
import { AddEmailNotificationDto } from '../dtos/add-email-notification.dto';
import { Mailer } from '../../utils/mailService';
import * as jwt from 'jsonwebtoken'
import { VerifySignersDto } from '../dtos/verify-signers.dto';
import { SubmitSignDto } from '../dtos/submit-sign.dto';
import { SignContractDto } from '../dtos/sign-contract.dto';
import { ContractService } from '../contract.service';
import * as ejs from 'ejs';
import * as jsreport from 'jsreport';
let jsReportInitialized = false;
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import JsReportService from 'src/utils/jsreport.service';

@Controller('signs')
export class SignersController {
    private jsReportService:JsReportService
    constructor(
        private response: ResponseHandler,
        private signers: SignersService,
        private mailer: Mailer,
        private contract: ContractService,
        private config: ConfigService,
    ) { 
        this.jsReportService = JsReportService.getInstance();
    };

    @Post('/invite-signers')
    @UseGuards(AuthGuard)
    async inviteSigners(@Req() req: Request, @Res() res: Response, @Body() body: InviteSignersDto) {
        try {
            const { contractId, addMembers, removeMembers } = body;

            let ifContractExsist = await this.signers.getContractById(contractId, req.user._id);

            if (ifContractExsist == null) {
                return this.response.error(res, 400, 'Contract dont exsist please check')
            };

            if (addMembers.length > 0) {
                for (let member of addMembers) {
                    if (member.email == req.user.email) {
                        return this.response.error(res, 400, 'You cant add yourself as signers')
                    };

                    let checkMemberAlreadyExsist = await this.signers.checkSigners({
                        contractId,
                        email: member.email,
                        createdBy: req.user._id,
                        status: 1
                    });

                    if (checkMemberAlreadyExsist) {
                        return this.response.error(res, 400, `${member.name} already added to the contract`)
                    };

                    await this.signers.createSigners({
                        contractId,
                        name: member.name || '',
                        email: member.email,
                        action: member.action,
                        createdBy: Types.ObjectId(req.user._id)
                    })
                }
            }

            if (removeMembers.length > 0) {
                for (let member of removeMembers) {
                    let checkSigners = await this.signers.checkSigners({
                        contractId,
                        email: member.email,
                        createdBy: req.user._id,
                        status: 1
                    });

                    if (checkSigners) {
                        await this.signers.deleteSigners({
                            contractId,
                            email: member.email,
                            createdBy: req.user._id,
                            status: 1
                        })
                    }
                }
            }

            let signers = await this.signers.getAllSignersByContract(contractId)

            return this.response.success(res, signers, 'Contract signers updated successfully')
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/all')
    @UseGuards(AuthGuard)
    async getAllSigns(@Req() req: Request, @Res() res: Response) {
        try {
            this.signers.getAllSigns(req.user._id).then(async data => {
                return this.response.success(res, data, "Signature listed")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/create')
    @UseGuards(AuthGuard)
    async addSignature(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { styling = null, signatureText = null, signatureId = null, canvaData = null, key = null } = body;

            if (signatureText == null && canvaData == null && key == null) {
                return this.response.error(res, 400, 'Please provide any type signature')
            }

            let queryObj = {
                status: 1,
                userId: req.user._id
            };

            let findSignature = await this.signers.findOneSign(queryObj);

            if (findSignature) {

                if (signatureText) {
                    findSignature["styling"] = styling;
                    findSignature["signatureText"] = signatureText;
                    findSignature["canvaData"] = null;
                    findSignature["key"] = null;
                };

                if (canvaData) {
                    findSignature["styling"] = null;
                    findSignature["signatureText"] = null;
                    findSignature["canvaData"] = canvaData;
                    findSignature["key"] = null;
                };

                if (key) {
                    findSignature["styling"] = null;
                    findSignature["signatureText"] = null;
                    findSignature["canvaData"] = null;
                    findSignature["key"] = key;
                };

                await findSignature.save();

                return this.response.success(res, findSignature, "Signature font has been added successfully")
            } else {
                let signObj = {
                    userId: req.user._id
                };

                if (signatureText) {
                    signObj["styling"] = styling;
                    signObj["signatureText"] = signatureText;
                    signObj["canvaData"] = null;
                    signObj["key"] = null;
                };

                if (canvaData) {
                    signObj["styling"] = null;
                    signObj["signatureText"] = null;
                    signObj["canvaData"] = canvaData;
                    signObj["key"] = null;
                };

                if (key) {
                    signObj["styling"] = null;
                    signObj["signatureText"] = null;
                    signObj["canvaData"] = null;
                    signObj["key"] = key;
                };

                this.signers.addSign(signObj).then(async data => {
                    return this.response.success(res, data, "Signature has been added successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }

    @Post('/add-sign')
    @UseGuards(AuthGuard)
    async addSign(@Req() req: Request, @Res() res: Response, @Body() body: AddSignFontDto) {
        try {
            const { pubKeyFingerprint, styling, signatureText, signatureId = '' } = body;

            if (signatureId && signatureId.toString().length > 0) {
                this.signers.updateSign(signatureId.toString(), {
                    pubKeyFingerprint,
                    styling,
                    signatureText,
                    userId: req.user._id,
                    imageData: null
                }).then(async data => {
                    return this.response.success(res, data, "Signature font has been added successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            } else {
                this.signers.addSign({
                    pubKeyFingerprint,
                    styling,
                    signatureText,
                    userId: req.user._id
                }).then(async data => {
                    return this.response.success(res, data, "Signature font has been added successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/sign-image')
    @UseGuards(AuthGuard)
    async addImageSign(@Req() req: Request, @Res() res: Response, @Body() body: AddDrawSignDto) {
        try {
            const { image, signatureId = '' } = body;

            if (signatureId && signatureId.toString().length > 0) {
                this.signers.updateSign(signatureId.toString(), {
                    imageData: image,
                    userId: req.user._id,
                    pubKeyFingerprint: null,
                    styling: null
                }).then(async data => {
                    return this.response.success(res, data, "Signature font has been added successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            } else {
                this.signers.addDrawSign({
                    imageData: image,
                    userId: req.user._id
                }).then(async data => {
                    return this.response.success(res, data, "Signature font has been added successfully")
                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/single-signer')
    @UseGuards(AuthGuard)
    async enableSingleSigner(@Req() req: Request, @Res() res: Response, @Body() body: EnableSingleUserDto) {
        try {
            const { contractId, enableSingleUser } = body;

            if (contractId && contractId.toString().length < 0) {
                return this.response.error(res, 400, "Please provide contractId")
            }

            let ifContractExsist = await this.signers.getContractById(contractId.toString(), req.user._id);

            if (ifContractExsist == null) {
                return this.response.error(res, 400, "COntract does not exsist")
            };

            this.signers.updateContract(contractId.toString(), {
                isSingleSigner: enableSingleUser,
                userId: req.user._id
            }).then(async data => {
                return this.response.success(res, data, "Contract has been updated successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Get('/signers')
    @UseGuards(AuthGuard)
    async getAllSigners(@Req() req: Request, @Res() res: Response, @Query('id') id: string) {
        try {
            this.signers.getMembers(id, req.user._id).then(async data => {
                return this.response.success(res, data, "Members listed")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/email-notification')
    @UseGuards(AuthGuard)
    async sendMailToSigners(@Req() req: Request, @Res() res: Response, @Body() body: AddEmailNotificationDto) {
        try {
            const { contractId, emailSub, emailMsg = "Please sign the document", expiry = 7 } = body;

            let ifContractExsist = await this.signers.getContractById(contractId.toString(), req.user._id.toString());

            if (ifContractExsist == null) {
                return this.response.error(res, 400, 'Contract does not exsist');
            };

            let members = await this.signers.getAllSignersByContract(contractId.toString());

            for (let member of members) {
                if (member && 'emailsent' in member && !member.emailsent) {

                    let updateData = {
                        emailData: {
                            emailSub,
                            emailMsg,
                            email: member.email
                        },
                        createdBy: req.user._id
                    };

                    let tokenData = {
                        _id: member._id,
                        name: member.name,
                        email: member.email,
                        contractId: member.contractId,
                        invitedBy: member.createdBy
                    };

                    let token = jwt.sign(tokenData, process.env.JWT_SECRET, {
                        expiresIn: expiry + 'd'
                    });

                    // need to add mailer functionality
                    this.mailer.contractInvitation({
                        email: member.email,
                        emailSub,
                        emailMsg,
                        userEmail: req.user.email,
                        userName: req.user.firstName,
                        signerName: member.name,
                        contractName: ifContractExsist.name,
                        inviteLink: process.env.FRONT_END_URL + '/app/contract/view/' + Buffer.from(contractId.toString()).toString('base64') + '/sign?token=' + Buffer.from(token).toString('base64')
                    }).then(async (resp) => {
                        updateData["emailsent"] = true
                        updateData["token"] = token
                        await this.signers.updateSigners(contractId, updateData)

                        return this.response.success(res, '', 'Email Notifcation Sent')

                    }).catch(err => {
                        return this.response.success(res, '', 'Email Notifcation Failed')
                    });
                }
            };
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/verify')
    async verifySigners(@Req() req: Request, @Res() res: Response, @Body() body: VerifySignersDto) {
        try {
            const { token } = body;

            let ifContractExsist = await this.signers.checkContractById(body.contractId);

            if (ifContractExsist == null) {
                return this.response.error(res, 400, 'Contract does not exsist');
            };

            let ifMemberExsist = await this.signers.checkSignerByToken({ token, status: 1, emailsent: true });

            if (ifMemberExsist == null) {
                return this.response.error(res, 400, 'Signer does not exsist in contract');
            };

            const { _id, email, name, createdBy, emailsent, contractId } = ifMemberExsist.toObject(),
                tokenData = { _id, email, name, createdBy, emailsent, contractId };

            let tokenStr = jwt.sign(tokenData, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            await ifMemberExsist.save()

            return this.response.success(res, { token: tokenStr, userData: ifMemberExsist }, 'User authenticated successfully')

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/submitted')
    @UseGuards(AuthGuard)
    async submitSign(@Req() req: Request, @Res() res: Response, @Body() body: SubmitSignDto) {
        try {
            const { contractId } = body;

            let ifContractExsist = await this.signers.checkContractById(contractId);

            if (ifContractExsist == null) {
                return this.response.error(res, 400, 'Contract does not exsist');
            };

            let ifMemberExsist = await this.signers.checkSignerByToken({ _id: req.user._id, status: 1, emailsent: true });

            if (ifMemberExsist == null) {
                return this.response.error(res, 400, 'Signer does not exsist in contract');
            };

            this.signers.updateDocStatus(contractId.toString(), req.user._id).then(async data => {
                return this.response.success(res, data, "Document Signed successfully")
            }).catch(err => {
                return this.response.error(res, 400, err)
            });

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    }

    @Post('/agree')
    @UseGuards(AuthGuard)
    async AgreeSigner(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { contractId, agree } = body;

            let ifContractExsist = await this.signers.checkContractById(contractId);

            if (ifContractExsist == null) {
                return this.response.error(res, 400, 'Contract does not exsist');
            };

            let ifMemberExsist = await this.signers.checkSignerByToken({ email: req.user.email, status: 1, contractId: Types.ObjectId(contractId) });

            if (ifMemberExsist == null) {
                return this.response.error(res, 400, 'Signer does not exsist in contract');
            };

            ifMemberExsist['isAgreed'] = true;
            await ifMemberExsist.save()
            ifMemberExsist['token'] = null;

            return this.response.success(res, ifMemberExsist, 'Signer agreed to sign the contract')

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    @Post('/declined')
    @UseGuards(AuthGuard)
    async declineSigning(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const { contractId } = body;

            let ifContractExsist = await this.signers.checkContractById(contractId);

            if (ifContractExsist == null) {
                return this.response.error(res, 400, 'Contract does not exsist');
            };

            let ifMemberExsist = await this.signers.checkSignerByToken({ email: req.user.email, status: 1 });

            if (ifMemberExsist == null) {
                return this.response.error(res, 400, 'Signer does not exsist in contract');
            };

            ifMemberExsist['isAgreed'] = false;
            ifMemberExsist['documentStatus'] = 0;

            await ifMemberExsist.save()

            return this.response.success(res, ifMemberExsist, 'Signer declined to sign the contract')

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

   // here when we or someone we sent it to wants to sign
    @Post('/sign-contract')
    @UseGuards(AuthGuard)
    async signContract(@Req() req: Request, @Res() res: Response, @Body() body: SignContractDto) {
        try {
            const { contractId, formData, images } = body;

            let ifContractExsist = await this.signers.checkContractAccessById(contractId, req.user);

            
            if (ifContractExsist == null) {
                return this.response.error(res, 400, "Please note you don't have access to sign the document ");
            };

            let ifFormExsist = await this.contract.getPdfData(contractId.toString());

            if (ifContractExsist.isSingleSigner && ifFormExsist == null) {
                
                this.contract.createPdfFormData({   
                    formData,
                    contractId,
                    images,
                    userId: req.user._id
                }).then(async data => {

                    if (ifContractExsist.isSingleSigner) {
                        await this.contract.updateSingleSigner(contractId.toString(), { documentStatus: 4 })
                    };

                    if (!ifContractExsist?.isSingleSigner) {
                        this.signers.updateDocStatus(contractId, req.user._id);
                    };

                    this.generatePdfForMail(req, res, ifContractExsist, data)

                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            } else {
                this.contract.updateContractPdfForm(contractId.toString(), {
                    formData, images
                }).then(async data => {

                    if (ifContractExsist.isSingleSigner) {
                        await this.contract.updateSingleSigner(contractId.toString(), { documentStatus: 4 })
                    };

                    if (!ifContractExsist?.isSingleSigner) {
                        this.signers.updateDocStatus(contractId, req.user._id);
                    };

                    this.generatePdfForMail(req, res, ifContractExsist, data)

                }).catch(err => {
                    return this.response.error(res, 400, err)
                });
            }

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    //tutaj XD    !!!
    @Post('/download-pdf')
    @UseGuards(AuthGuard)
    async downloadPdf (@Req() req: Request, @Res() res: Response,@Query() query: any) {
        try {
            const { contractId} = query;

            let ifContractExsist = await this.signers.checkContractAccessById(contractId, req.user);

            if (ifContractExsist == null) {
                return this.response.error(res, 400, "Please note you don't have access to dowlonad the document ");
            };

            let PdfData = await this.contract.getPdfData(contractId.toString());

            var content = fs.readFileSync(path.join(__dirname, '../../../public/templates/layout.ejs'), 'utf8');

            const html = ejs.render(content, {
                images: PdfData.images,
                base_url: this.config.get('BASE_URL')
            });
                

            this.jsReportService.render({
                template: {
                content: html,
                engine: 'handlebars',
                recipe: 'chrome-pdf',
                }
            }).then((out)=>{
                let contractName = `contract-${Date.now()}.pdf`;
                let pdfPath = path.join(__dirname, `../../../public/${contractName}`)
                var output = fs.createWriteStream(pdfPath)
                out.stream.pipe(output);
                out.stream.on('end', () => {
                    let filepathfromResponse = pdfPath
                    let lastParam = filepathfromResponse.split('/')
                    let filepath = { path: `${this.config.get('BASE_URL')}templates/${contractName}` };
                    return this.response.success(res, filepath, 'Contract exported successfully')
                })
            }).catch((e)=>{
                return this.response.forbiddenError(res, 'Something went wrong. Please try again.')
            });

        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };


    //download pdf from email
    async generatePdfForMail(req, res, ifContractExsist, data = null) {
        var content = fs.readFileSync(path.join(__dirname, '../../../public/templates/layout.ejs'), 'utf8');

        const html = ejs.render(content, {
            images: data.images
        });

        this.jsReportService.render({
            template: {
                content: html,
                engine: 'handlebars',
                recipe: 'chrome-pdf'
            }
        }).then(async (out) => {
            await this.mailer.sendContractPdf({
                fileName: ifContractExsist?.name,
                userName: req?.user?.name ? req?.user?.name : req?.user?.firstName + ' ' + req?.user.lastName,
                attachment: out.content,
                email: 'firnaas@cineacloud.com' //here we can add an email and have the option to download pdf from email
            });

            return this.response.success(res, '', "Contract signed successfully")

        }).catch((e) => {
            return this.response.forbiddenError(res, 'Something went wrong. Please try again.')
        });
    }


    //pdf logic for budget shotDesign and treatment app 

    //budget app pdf download
    @Post('/downloadBudgetPdf')
    @UseGuards(AuthGuard)
    async downloadBudgetPdf (@Req() req: Request, @Res() res: Response,@Body() body: any) {
        try {
            
           const {content} = req.body

            const logoPath = path.resolve(__dirname, "../../../public/templates/assets/logo2.png");
            let logoDataURL;
            if (fs.existsSync(logoPath)) {
              const logoData = fs.readFileSync(logoPath);
              logoDataURL = "data:image/png;base64," + logoData.toString("base64");
            }

            const currentDate = new Date();
            const optionsDate:any = { year: "numeric", month: "long", day: "numeric" };
            const formattedDate = currentDate.toLocaleDateString("en-US", optionsDate);
          
            const htmlPath = fs.readFileSync(path.join(
                __dirname,
                "../../../public/templates/budget.ejs"
            ), 'utf8');
    
            const html = ejs.render(htmlPath, {
                createdAt: formattedDate,
                logoImg: logoDataURL,
                htmlData: content.budgetSectionHtml,
                totalPrice: content.totalPriceHtml,
                base_url: this.config.get('BASE_URL')
            });
            
            this.jsReportService.render({
                template: {
                    content: html,
                    engine: 'handlebars',
                    recipe: 'chrome-pdf',
                }
            }).then((out) => {
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=yourFileName.pdf',
                });
                out.stream.pipe(res);
            }).catch((e) => {
                return this.response.forbiddenError(res, 'Something went wrong. Please try again.');
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };




    //shot design app pdf download
    @Post('/downloadShotDesignPdf')
    @UseGuards(AuthGuard)
    async downloadShotDesignPdf (@Req() req: Request, @Res() res: Response,@Body() body: any) {
        try {
           const {content} = req.body

           const base64Data = content.shotDesign.split(";base64,").pop();
           const image = "data:image/jpeg;base64," + base64Data;

            const logoPath = path.resolve(__dirname, "../../../public/templates/assets/logo2.png");
            let logoDataURL;
            if (fs.existsSync(logoPath)) {
              const logoData = fs.readFileSync(logoPath);
              logoDataURL = "data:image/png;base64," + logoData.toString("base64");
            }

            const dateObj = new Date(content.createdAt);
             const options:any = { year: "numeric", month: "long", day: "numeric" };
            const formattedDate = dateObj.toLocaleDateString("en-US", options);
                    
            const htmlPath = fs.readFileSync(path.join(
                __dirname,
                "../../../public/templates/shot-design.ejs"
            ), 'utf8');
    
            const html = ejs.render(htmlPath, {
                createdAt: formattedDate,
                desc: content.description,
                shotDesign: image,
                logoImg: logoDataURL,
                base_url: this.config.get('BASE_URL')
            });
            
            this.jsReportService.render({
                template: {
                    content: html,
                    engine: 'handlebars',
                    recipe: 'chrome-pdf',
                }
            }).then((out) => {
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=yourFileName.pdf',
                });
                out.stream.pipe(res);
            }).catch((e) => {
                return this.response.forbiddenError(res, 'Something went wrong. Please try again.');
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };


    @Post('/downloadTreatmentPdf')
    @UseGuards(AuthGuard)
    async downloadTreatment (@Req() req: Request, @Res() res: Response,@Body() body: any) {
        try {
           const {content} = req.body
           //treatmentContent basic html 
           //quillContent full html


            const logoPath = path.resolve(__dirname, "../../../public/templates/assets/logo2.png");
            let logoDataURL;
            if (fs.existsSync(logoPath)) {
              const logoData = fs.readFileSync(logoPath);
              logoDataURL = "data:image/png;base64," + logoData.toString("base64");
            }

            const currentDate = new Date();
            const optionsDate:any = { year: "numeric", month: "long", day: "numeric" };
            const formattedDate = currentDate.toLocaleDateString("en-US", optionsDate);

            const htmlPath = fs.readFileSync(path.join(
                __dirname,
                "../../../public/templates/treatment.ejs"
            ), 'utf8');
    
            const html = ejs.render(htmlPath, {
                createdAt: formattedDate,
                logoImg: logoDataURL,
                htmlData: content.treatmentContent,
            });
            
            this.jsReportService.render({
                template: {
                    content: html,
                    engine: 'handlebars',
                    recipe: 'chrome-pdf',
                }
            }).then((out) => {
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=yourFileName.pdf',
                });
                out.stream.pipe(res);
            }).catch((e) => {
                return this.response.forbiddenError(res, 'Something went wrong. Please try again.');
            });
        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };

    //progress report app pdf 
    @Post('/downloadProgressReportPdf')
    @UseGuards(AuthGuard)
    async downloadProgressReportPdf (@Req() req: Request, @Res() res: Response,@Body() body: any) {
        try {
            
            const {content} = req.body
            let htmlData = content.progressHtmlData
           
            const logoPath = path.resolve(__dirname, "../../../public/templates/assets/logo2.png");
            let logoDataURL;
            if (fs.existsSync(logoPath)) {
                const logoData = fs.readFileSync(logoPath);
                logoDataURL = "data:image/png;base64," + logoData.toString("base64");
            }

            const currentDate = new Date();
            const optionsDate:any = { year: "numeric", month: "long", day: "numeric" };
            const formattedDate = currentDate.toLocaleDateString("en-US", optionsDate);
            
            const htmlPath = fs.readFileSync(path.join(
                __dirname,
                "../../../public/templates/progress-report.ejs"
            ), 'utf8');
    
            const html = ejs.render(htmlPath, {
                createdAt: formattedDate,
                logoImg: logoDataURL,
                base_url: this.config.get('BASE_URL'),
                // progress report data 
                PrCompany: htmlData.productionCompany,
                PrAddress: htmlData.ProductionAddress,
                PrPhone: htmlData.productionPhone,
                PrEmail: htmlData.productionEmail,
                PrWebstie: htmlData.productionWebsite,
                PrOther1: htmlData.other1,
                // main info 
                scheduleName: htmlData.scheduleName,
                scheduleCallTime: htmlData.scheduleCallTime,
                scheduleCallSheetName: htmlData.scheduleCallSheetName,
                scheduleDate: htmlData.scheduleDate,
                // director etc data:
                director: htmlData.director,
                dop: htmlData.dop,
                executeProducer: htmlData.executeProducer,
                firstStad: htmlData["1stad"],
                secondNdad: htmlData["2ndad"],
                Other2: htmlData.Other2,
                //2nd section
                startDate: htmlData.startDate,
                estEndDate: htmlData.estEndDate,
                daysShot: htmlData.daysShot,
                daysRemaining: htmlData.daysRemaining,
                FirstStshotofday: htmlData["1stshotofday"],
                lastshotofday: htmlData.lastshotofday,
                //2 section part 2
                TotalScenesShot: htmlData.TotalScenesShot,
                SceneRemaining: htmlData.SceneRemaining,
                ExtraScenes: htmlData.ExtraScenes,
                TotalPagesShot: htmlData.TotalPagesShot,
                PagesRemaining: htmlData.PagesRemaining,
                TotalMinsShot: htmlData.TotalMinsShot,
                //2 section part 3
                CrewCall: htmlData.CrewCall,
                CrewWrapUp: htmlData.CrewWrapUp,
                stMealIn: htmlData["1stMealIn"],
                stMealOut: htmlData["1stMealOut"],
                ndMealIn: htmlData["2ndMealIn"],
                SndMealOut: htmlData["2ndMealOut"],
                //3 section table
                sceneTable: htmlData.sceneTable,
                castListTable: htmlData.castListTable,
                crewTable: htmlData.crewTable,
                mediaTable: htmlData.mediaTable,
                paymentTable: htmlData.paymentTable,
                // 4 section 
                AudioNotes: htmlData.AudioNotes,
                equipmentNotes: htmlData.equipmentNotes,
                remarks: htmlData.remarks

            });
            
            this.jsReportService.render({
                template: {
                    content: html,
                    engine: 'handlebars',
                    recipe: 'chrome-pdf',
                }
            }).then((out) => {
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=yourFileName.pdf',
                });
                out.stream.pipe(res);
            }).catch((e) => {
                return this.response.forbiddenError(res, 'Something went wrong. Please try again.');
            });


        } catch (e) {
            return this.response.errorInternal(e, res)
        }
    };



}
