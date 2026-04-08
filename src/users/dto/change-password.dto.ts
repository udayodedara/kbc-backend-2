import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({ example: 'password1234', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID submitting the answers',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;
}
