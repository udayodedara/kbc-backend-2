import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AvatarsController],
  providers: [AvatarsService, PrismaService],
})
export class AvatarsModule {}
