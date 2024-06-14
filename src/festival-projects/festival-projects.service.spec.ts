import { Test, TestingModule } from '@nestjs/testing';
import { FestivalProjectsService } from './festival-projects.service';

describe('FestivalProjectsService', () => {
  let service: FestivalProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FestivalProjectsService],
    }).compile();

    service = module.get<FestivalProjectsService>(FestivalProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
