import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePayDto } from './dtos/create-pay.dto';
import { Payments,  PaymentDocument } from './model/festival-payment.schema'; 

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel(Payments.name) private paymentModel: Model<PaymentDocument>,
    ) {};
    
    async createPayment(data: Partial<CreatePayDto>, userId: string, bookingId: string) {
        const payments = new this.paymentModel(data);
        Object.assign(payments, {
            userId,
            bookingId 
        });
        return await payments.save();
    };

    async getPayments(id: string, userId: string) {
        if (!id) return null;
        return this.paymentModel.findOne({
            _id: Types.ObjectId(id),
            userId: Types.ObjectId(userId),
            status: 1
        }).exec();
    };

    async findOneUpdate(id: string, data: any, userId: string) {
        const payment = await this.getPayments(id, userId);
        if (!payment) throw new NotFoundException('Payment Not found');
        Object.assign(payment, data);
        return payment.save()
    };

}
