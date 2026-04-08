import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(createAppConfigDto: CreateAppConfigDto) {
    // Compare user-provided key with the actual secret key
    if (createAppConfigDto.secretKey !== process.env.SECRET_KEY) {
      throw new UnauthorizedException('Invalid secret key');
    }
    const { secretKey, ...configData } = createAppConfigDto;
    // Check if there's already an app config
    const existingConfig = await this.prisma.appConfig.findFirst();

    if (existingConfig) {
      return this.prisma.appConfig.update({
        where: { id: existingConfig.id },
        data: configData,
      });
    }

    // If no config exists, create a new one
    return this.prisma.appConfig.create({
      data: configData,
    });
  }

  async findOne() {
    return this.prisma.appConfig.findMany();
  }
}
