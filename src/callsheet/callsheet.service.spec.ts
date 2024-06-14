import { Test, TestingModule } from '@nestjs/testing';
import { CallsheetService } from './callsheet.service';

describe('CallsheetService', () => {
  let service: CallsheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallsheetService],
    }).compile();

    service = module.get<CallsheetService>(CallsheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
