import { Test, TestingModule } from '@nestjs/testing';
import { PropsController } from './props.controller';

describe('PropsController', () => {
  let controller: PropsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropsController],
    }).compile();

    controller = module.get<PropsController>(PropsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
