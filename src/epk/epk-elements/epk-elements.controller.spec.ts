import { Test, TestingModule } from '@nestjs/testing';
import { EpkElementsController } from './epk-elements.controller';

describe('EpkElementsController', () => {
  let controller: EpkElementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpkElementsController],
    }).compile();

    controller = module.get<EpkElementsController>(EpkElementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
