import { Test, TestingModule } from '@nestjs/testing';
import { EpkController } from './epk.controller';

describe('EpkController', () => {
  let controller: EpkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpkController],
    }).compile();

    controller = module.get<EpkController>(EpkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
