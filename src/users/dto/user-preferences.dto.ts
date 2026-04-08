import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UserPreferencesDto {
  @ApiProperty({
    example: true,
    description: 'Enable or disable notifications',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  notifications?: boolean;

  @ApiProperty({
    example: false,
    description: 'Enable or disable sound',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  sound?: boolean;

  @ApiProperty({
    example: true,
    description: 'Enable or disable background music',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  music?: boolean;
}
