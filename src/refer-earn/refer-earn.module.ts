import { Module } from '@nestjs/common';
import { ReferEarnService } from './refer-earn.service';
import { ReferEarnController } from './refer-earn.controller';

@Module({
  controllers: [ReferEarnController],
  providers: [ReferEarnService],
})
export class ReferEarnModule {}
