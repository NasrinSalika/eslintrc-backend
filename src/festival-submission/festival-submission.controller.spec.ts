import { Test, TestingModule } from '@nestjs/testing';
import { FestivalSubmissionController } from './festival-submission.controller';

describe('FestivalSubmissionController', () => {
  let controller: FestivalSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FestivalSubmissionController],
    }).compile();

    controller = module.get<FestivalSubmissionController>(FestivalSubmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
