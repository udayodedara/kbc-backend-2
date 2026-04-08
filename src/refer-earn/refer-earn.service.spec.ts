import { Test, TestingModule } from '@nestjs/testing';
import { ReferEarnService } from './refer-earn.service';

describe('ReferEarnService', () => {
  let service: ReferEarnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferEarnService],
    }).compile();

    service = module.get<ReferEarnService>(ReferEarnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
