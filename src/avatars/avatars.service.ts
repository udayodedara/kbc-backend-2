import { Injectable } from '@nestjs/common';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AvatarsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.avatar.findMany({
        where: {
          isAvailable: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
