import { Test, TestingModule } from '@nestjs/testing';
import { CastController } from './cast.controller';
import { CastService } from './cast.service';

describe('cast', () => {
  let controller: CastController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CastController],
      providers: [CastService],
    }).compile();

    controller = module.get<CastController>(CastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
