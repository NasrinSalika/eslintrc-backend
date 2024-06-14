import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseHandler } from 'src/utils/response.handler';
import { StripeService } from 'src/utils/stripe.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payments, PaymentSchema } from './model/festival-payment.schema';
import { FestivalSubmissionService } from 'src/festival-submission/festival-submission.service';
import { StatusTypes, StatusTypesSchema } from 'src/festival-submission/model/status.schema';
import { Festivals, FestivalsSchema } from 'src/festival/models/festival.schema';
import { Carts, CartSchema } from 'src/festival-submission/model/cart.schema';
import { FestivalSubmission, SubmissionSchema } from 'src/festival-submission/model/submission.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payments.name,
        schema: PaymentSchema
      },
      {
        name: StatusTypes.name,
        schema: StatusTypesSchema
      },
      {
        name: Festivals.name,
        schema: FestivalsSchema
      },
      {
        name: Carts.name,
        schema: CartSchema
      },
      {
        name: FestivalSubmission.name,
        schema: SubmissionSchema
      },
    ])
  ],
  controllers: [
    PaymentsController
  ],
  providers: [
    PaymentsService,
    ResponseHandler,
    StripeService,
    FestivalSubmissionService
  ]
})
export class PaymentsModule { }
