import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookmarkQuestionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the user bookmarking the question',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the question to be bookmarked',
    example: '456e7890-e89b-12d3-a456-426614174111',
  })
  questionId: string;
}
