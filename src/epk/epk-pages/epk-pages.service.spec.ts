import { Test, TestingModule } from '@nestjs/testing';
import { EpkPagesService } from './epk-pages.service';

describe('EpkPagesService', () => {
  let service: EpkPagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpkPagesService],
    }).compile();

    service = module.get<EpkPagesService>(EpkPagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
