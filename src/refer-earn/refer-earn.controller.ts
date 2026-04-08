import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReferEarnService } from './refer-earn.service';
import { CreateReferEarnDto } from './dto/create-refer-earn.dto';
import { UpdateReferEarnDto } from './dto/update-refer-earn.dto';

@Controller('refer-earn')
export class ReferEarnController {
  constructor(private readonly referEarnService: ReferEarnService) {}

  @Post()
  create(@Body() createReferEarnDto: CreateReferEarnDto) {
    return this.referEarnService.create(createReferEarnDto);
  }

  @Get()
  findAll() {
    return this.referEarnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referEarnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReferEarnDto: UpdateReferEarnDto) {
    return this.referEarnService.update(+id, updateReferEarnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referEarnService.remove(+id);
  }
}
