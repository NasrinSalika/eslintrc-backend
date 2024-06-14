import { Module } from '@nestjs/common';
import { FestivalProjectsController } from './festival-projects.controller';
import { FestivalProjectsService } from './festival-projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectTypes, ProjectTypesSchema } from './models/project-type.schema';
import { FestivalProjects, ProjectsSchema } from './models/project.schema';
import { FestivalProjectCategory, FestivalProjectCategorySchema } from './models/project-category.schema';
import { ProjectTypeService } from './project-type.service';
import { ResponseHandler } from 'src/utils/response.handler';
import { FestivalFiles, FilesSchema } from 'src/festival/models/files.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: ProjectTypes.name,
        schema: ProjectTypesSchema 
      },
      {
        name: FestivalProjects.name,
        schema: ProjectsSchema 
      },
      {
        name: FestivalProjectCategory.name,
        schema: FestivalProjectCategorySchema 
      },
      {
        name: FestivalFiles.name,
        schema: FilesSchema
      },
    ])
  ],
  controllers: [
    FestivalProjectsController
  ],
  providers: [
    FestivalProjectsService,
    ProjectTypeService,
    ResponseHandler
  ]
})
export class FestivalProjectsModule {}
