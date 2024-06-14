import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FestivalModule } from './festival/festival.module';
import { FestivalSubmissionModule } from './festival-submission/festival-submission.module';
import { FestivalProjectsModule } from './festival-projects/festival-projects.module';
import { CurrentUserMiddleware } from './Middelwares/current-user.middleware';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { PaymentsModule } from './payments/payments.module';
import { ContractModule } from './contract/contract.module';
import { User, UsersSchema } from './users/model/users.schema';
import { ContractSigners, SignersSchema } from './contract/models/contract-signer.schema';
import { EpkModule } from './epk/epk.module';
import { PropsModule } from './props/props.module';
import { MediasModule } from './medias/medias.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationModule } from './notification/notification.module';
import { CallsheetModule } from './callsheet/callsheet.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { UserProjectModule } from './user-project/user-project.module';
import { ContactModule } from './contact/contact.module';
import { LocationModule } from './location/location.module';
import { CastModule } from './cast/cast.module';
import { DesignUser, DesignUserSchema } from './users/model/design-user.schema';
import { EpkService } from './epk/epk.service';
import { EpkSchema, Epks } from './epk/models/epk.schema';
import { EpkTemplates, EpkTemplatesSchema } from './epk/models/epk-template.schema';
import { InviteMembers, InviteMembersSchema } from './epk/models/invite.schema';
import { EpkPages, EpkPagesSchema } from './epk/models/epk-pages.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URI'),
        dbName: configService.get<string>('DB_NAME'),
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UsersSchema,
      },
      {
        name: ContractSigners.name,
        schema: SignersSchema,
      },
      {
        name: DesignUser.name,
        schema: DesignUserSchema
      },
      {
        name: Epks.name,
        schema: EpkSchema
    },
    {
        name: EpkTemplates.name,
        schema: EpkTemplatesSchema
    },
    {
        name: InviteMembers.name,
        schema: InviteMembersSchema
    },
    {
        name: EpkPages.name,
        schema: EpkPagesSchema
    }
    ]),
    UsersModule,
    FestivalModule,
    FestivalSubmissionModule,
    FestivalProjectsModule,
    AdminDashboardModule,
    PaymentsModule,
    ContractModule,
    EpkModule,
    PropsModule,
    MediasModule,
    CommentsModule,
    NotificationModule,
    CallsheetModule,
    CollaborationModule,
    UserProjectModule,
    ContactModule,
    LocationModule,
    CastModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    EpkService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.GET },
        { path: 'users/signin', method: RequestMethod.POST },
        { path: 'users/signup', method: RequestMethod.POST },
        { path: 'festival/all-countires', method: RequestMethod.GET },
        { path: 'festival/all-events', method: RequestMethod.GET },
        { path: 'festival/all-focus', method: RequestMethod.GET },
        { path: 'festival/all-category', method: RequestMethod.GET },
        { path: 'festival/all-currency', method: RequestMethod.GET },
        { path: 'festival/browse', method: RequestMethod.GET },
        { path: 'festival/filters', method: RequestMethod.GET },
        { path: 'projects/all-type', method: RequestMethod.GET },
        { path: 'projects/all-category', method: RequestMethod.GET },
        { path: 'submission/all-status', method: RequestMethod.GET },
        { path: 'submission/get-festival', method: RequestMethod.GET },
        { path: 'submission/get-prices/:id', method: RequestMethod.GET },
        { path: 'admin/test-mail', method: RequestMethod.GET },
        { path: 'epk/elements', method: RequestMethod.GET },
        // { path: 'epk/download', method: RequestMethod.GET },
        // { path: 'public/templates/assets/logo.png', method: RequestMethod.GET },
        { path: 'epk/elements', method: RequestMethod.POST },
        { path: 'signs/verify', method: RequestMethod.POST },
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/extend-session', method: RequestMethod.GET },
        { path: 'users/add-premium-user', method: RequestMethod.POST },
        { path: 'contract/conversion-status', method: RequestMethod.POST },
        { path: 'contract/file-status', method: RequestMethod.POST },
        { path: '/login-ovniq', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
