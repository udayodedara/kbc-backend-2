import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class EditProfileDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 30)
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 30)
  lastName?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  //   @ApiProperty({
  //     example: 'some_fcm_token_here',
  //     description: 'FCM Token for push notifications',
  //     required: false,
  //   })
  //   @IsString()
  //   @IsOptional()
  //   fcmToken?: string;

  @ApiProperty({
    example: 1,
    description: 'Avatar ID reference',
    required: false,
  })
  @IsInt()
  @IsOptional()
  avatarId?: number;
}
