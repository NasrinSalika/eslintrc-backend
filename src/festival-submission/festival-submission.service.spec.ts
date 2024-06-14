import { Test, TestingModule } from '@nestjs/testing';
import { FestivalSubmissionService } from './festival-submission.service';

describe('FestivalSubmissionService', () => {
  let service: FestivalSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FestivalSubmissionService],
    }).compile();

    service = module.get<FestivalSubmissionService>(FestivalSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
