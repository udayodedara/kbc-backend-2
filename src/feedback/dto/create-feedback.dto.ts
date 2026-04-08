import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'user-id-uuid', description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'question-id-uuid',
    description: 'Question ID (optional)',
  })
  @IsUUID()
  @IsOptional()
  questionId?: string;

  @ApiProperty({
    example: 'Great question, loved it!',
    description: 'Feedback text',
  })
  @IsString()
  @IsNotEmpty()
  feedback: string;
}
