import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app-config')
@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Post()
  async createOrUpdate(@Body() createAppConfigDto: CreateAppConfigDto) {
    return await this.appConfigService.createOrUpdate(createAppConfigDto);
  }

  @Get()
  async findOne() {
    return this.appConfigService.findOne();
  }
}
