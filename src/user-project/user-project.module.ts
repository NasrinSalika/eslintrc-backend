import { Module } from '@nestjs/common';
import { ProjectSchema, UserProjects } from './model/project.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserProjects.name,
        schema: ProjectSchema
      }
    ])
  ],
  controllers: [],
  providers: []
})
export class UserProjectModule { }
