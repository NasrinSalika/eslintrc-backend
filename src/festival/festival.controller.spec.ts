import { Test, TestingModule } from '@nestjs/testing';
import { FestivalController } from './festival.controller';

describe('FestivalController', () => {
  let controller: FestivalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FestivalController],
    }).compile();

    controller = module.get<FestivalController>(FestivalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
