import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  firstName: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  lastName: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false,
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'some_fcm_token_here',
    description: 'FCM Token for push notifications',
    required: false,
  })
  @IsString()
  @IsOptional()
  fcmToken?: string;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean = false;

  @ApiProperty({
    example: 1,
    description: 'Avatar ID reference',
    required: false,
  })
  @IsInt()
  avatarId: number;

  @IsInt()
  @IsOptional()
  availableStamps?: number = 0;
}
