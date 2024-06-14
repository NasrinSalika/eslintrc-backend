import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseHandler } from 'src/utils/response.handler';
import { FestivalSubmissionController } from './festival-submission.controller';
import { FestivalSubmissionService } from './festival-submission.service';
import { StatusTypesSchema, StatusTypes } from './model/status.schema';
import { Festivals, FestivalsSchema } from '../festival/models/festival.schema';
import { FestivalProjectsService } from 'src/festival-projects/festival-projects.service';
import { FestivalProjects, ProjectsSchema } from '../festival-projects/models/project.schema';
import { StripeService } from 'src/utils/stripe.service';
import { Carts, CartSchema } from './model/cart.schema';
import { FestivalSubmission, SubmissionSchema } from './model/submission.schema'; 
@Module({
  imports: [ 
    MongooseModule.forFeature([
      {
        name: Festivals.name,
        schema: FestivalsSchema 
      },
      {
        name: Carts.name,
        schema: CartSchema 
      },
      {
        name: StatusTypes.name,
        schema: StatusTypesSchema 
      },
      {
        name: FestivalProjects.name,
        schema: ProjectsSchema 
      },
      {
        name: FestivalSubmission.name,
        schema: SubmissionSchema 
      },
    ])
  ],
  controllers: [
    FestivalSubmissionController
  ],
  providers: [
    FestivalSubmissionService,
    FestivalProjectsService,
    ResponseHandler,
    StripeService
  ]
})
export class FestivalSubmissionModule {}
