import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }

  async findAll() {
    try {
      const quotes = await this.prisma.quotes.findMany({
        where: { isAvailable: true },
      });
      return this.shuffleArray(quotes).slice(0, 10); // Shuffle and take 10
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
