import { Test, TestingModule } from '@nestjs/testing';
import { TrackerController } from './tracker.controller';
import { DailyProgressService } from './daily-progress.service';

describe('TrackerController', () => {
  let controller: TrackerController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackerController],
      providers: [DailyProgressService],
    }).compile();

    controller = module.get<TrackerController>(TrackerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
