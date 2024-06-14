import { Test, TestingModule } from '@nestjs/testing';
import { FestivalProjectsController } from './festival-projects.controller';

describe('FestivalProjectsController', () => {
  let controller: FestivalProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FestivalProjectsController],
    }).compile();

    controller = module.get<FestivalProjectsController>(FestivalProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
