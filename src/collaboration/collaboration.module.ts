import { Module } from '@nestjs/common';
import { CollaborationController } from './collaboration.controller';
import { CollaborationService } from './collaboration.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IndividualInvite, IndividualInviteSchema } from './models/individual-invites.schema';
import { ResponseHandler } from 'src/utils/response.handler';
import { UsersService } from 'src/users/users.service';
import { User, UsersSchema } from 'src/users/model/users.schema';
import { ProjectSchema, UserProjects } from 'src/user-project/model/project.schema';
import { PremiumUserSchema, PremiumUsers } from 'src/users/model/premium-user.schema';
import { PropsService } from 'src/props/props.service';
import { Props, PropsSchema } from 'src/props/models/props.schema';
import { PropsMember, PropsMemberSchema } from 'src/props/models/props-members.schema';
import { Mailer } from 'src/utils/mailService';
import { CallsheetService } from 'src/callsheet/callsheet.service';
import { Callsheet, CallsheetSchema } from 'src/callsheet/models/callsheet.schema';
import { EpkService } from 'src/epk/epk.service';
import { EpkSchema, Epks } from 'src/epk/models/epk.schema';
import { InviteMembers, InviteMembersSchema } from 'src/epk/models/invite.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IndividualInvite.name, schema: IndividualInviteSchema },
      { name: User.name, schema: UsersSchema },
      { name: UserProjects.name, schema: ProjectSchema },
      { name: PremiumUsers.name, schema: PremiumUserSchema },
      { name: Props.name, schema: PropsSchema },
      { name: PropsMember.name, schema: PropsMemberSchema },
      { name: Callsheet.name, schema: CallsheetSchema },
      { name: Epks.name, schema: EpkSchema },
      { name: InviteMembers.name, schema: InviteMembersSchema }
    ])
  ],
  controllers: [
    CollaborationController
  ],
  providers: [
    CollaborationService,
    ResponseHandler,
    UsersService,
    PropsService,
    Mailer,
    CallsheetService,
    EpkService
  ]
})
export class CollaborationModule {}
