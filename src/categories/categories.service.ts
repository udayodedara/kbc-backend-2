import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.categories.findMany({
        where: {
          isAvailable: true,
        },
        orderBy: {
          sortIndex: 'asc',
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
