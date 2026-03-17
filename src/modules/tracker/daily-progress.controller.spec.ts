import { Test, TestingModule } from '@nestjs/testing';
import { DailyProgressController } from './daily-progress.controller';
import { DailyProgressService } from './daily-progress.service';

describe('DailyProgressController', () => {
  let controller: DailyProgressController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyProgressController],
      providers: [DailyProgressService],
    }).compile();

    controller = module.get<DailyProgressController>(DailyProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
