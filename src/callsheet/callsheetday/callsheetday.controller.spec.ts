import { Test, TestingModule } from '@nestjs/testing';
import { CallsheetdayController } from './callsheetday.controller';

describe('CallsheetdayController', () => {
  let controller: CallsheetdayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallsheetdayController],
    }).compile();

    controller = module.get<CallsheetdayController>(CallsheetdayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
