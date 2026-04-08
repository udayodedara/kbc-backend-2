import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { AppConfigController } from './app-config.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AppConfigController],
  providers: [AppConfigService,PrismaService],
})
export class AppConfigModule {}
