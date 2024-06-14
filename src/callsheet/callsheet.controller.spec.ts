import { Test, TestingModule } from '@nestjs/testing';
import { CallsheetController } from './callsheet.controller';

describe('CallsheetController', () => {
  let controller: CallsheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallsheetController],
    }).compile();

    controller = module.get<CallsheetController>(CallsheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
