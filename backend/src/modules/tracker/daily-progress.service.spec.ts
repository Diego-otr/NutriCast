import { Test, TestingModule } from '@nestjs/testing';
import { DailyProgressService } from './daily-progress.service';

describe('DailyProgressService', () => {
  let service: DailyProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyProgressService],
    }).compile();

    service = module.get<DailyProgressService>(DailyProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
