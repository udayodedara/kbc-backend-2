import { Injectable } from '@nestjs/common';
import { CreateReferEarnDto } from './dto/create-refer-earn.dto';
import { UpdateReferEarnDto } from './dto/update-refer-earn.dto';

@Injectable()
export class ReferEarnService {
  create(createReferEarnDto: CreateReferEarnDto) {
    return 'This action adds a new referEarn';
  }

  findAll() {
    return `This action returns all referEarn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} referEarn`;
  }

  update(id: number, updateReferEarnDto: UpdateReferEarnDto) {
    return `This action updates a #${id} referEarn`;
  }

  remove(id: number) {
    return `This action removes a #${id} referEarn`;
  }
}
