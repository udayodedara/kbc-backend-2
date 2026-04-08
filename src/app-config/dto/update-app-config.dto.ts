import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateAppConfigDto {
  @ApiProperty({ description: 'The terms link of the application', required: false })
  @IsString()
  @IsOptional()
  termsLink?: string;

  @ApiProperty({ description: 'The privacy policy link of the application', required: false })
  @IsString()
  @IsOptional()
  privacyPolicy?: string;

  @ApiProperty({ description: 'The minimum supported version of the application', required: false })
  @IsString()
  @IsOptional()
  minimumSupportedVersion?: string;

  @ApiProperty({ description: 'The disclaimer text of the application', required: false })
  @IsString()
  @IsOptional()
  disclaimer?: string;

  @ApiProperty({ description: 'The play store URL of the application', required: false })
  @IsString()
  @IsOptional()
  playStoreUrl?: string;
}
