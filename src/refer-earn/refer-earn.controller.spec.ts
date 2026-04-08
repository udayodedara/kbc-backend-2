import { Test, TestingModule } from '@nestjs/testing';
import { ReferEarnController } from './refer-earn.controller';
import { ReferEarnService } from './refer-earn.service';

describe('ReferEarnController', () => {
  let controller: ReferEarnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferEarnController],
      providers: [ReferEarnService],
    }).compile();

    controller = module.get<ReferEarnController>(ReferEarnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
