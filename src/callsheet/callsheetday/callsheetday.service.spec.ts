import { Test, TestingModule } from '@nestjs/testing';
import { CallsheetdayService } from './callsheetday.service';

describe('CallsheetdayService', () => {
  let service: CallsheetdayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallsheetdayService],
    }).compile();

    service = module.get<CallsheetdayService>(CallsheetdayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
