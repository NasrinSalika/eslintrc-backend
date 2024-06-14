import { Test, TestingModule } from '@nestjs/testing';
import { EpkPagesController } from './epk-pages.controller';

describe('EpkPagesController', () => {
  let controller: EpkPagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpkPagesController],
    }).compile();

    controller = module.get<EpkPagesController>(EpkPagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
