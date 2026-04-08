// add-stamps.dto.ts
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStampsDto {
  @ApiProperty({ example: 10, description: 'Number of stamps to add' })
  @IsInt()
  @Min(1)
  count: number;
}
