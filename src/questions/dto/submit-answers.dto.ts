import {
  IsString,
  IsUUID,
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AnswerDto {
  @IsUUID() // Ensures that the questionId is a valid UUID
  @IsString()
  @ApiProperty({
    description: 'The ID of the question being answered',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The selected answer for the question',
    example: 'a', // Example of a selected answer (you can adjust based on your app)
  })
  selectedAnswer: string;
}

export class SubmitAnswersDto {
  @IsUUID() // Ensures userId is a valid UUID
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID submitting the answers',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @IsArray() // Ensures it's an array
  @ApiProperty({
    type: [AnswerDto], // Specify the type to be an array of AnswerDto objects
    description: 'The list of answers submitted by the user',
    example: [
      {
        questionId: '123e4567-e89b-12d3-a456-426614174000',
        selectedAnswer: 'a',
      },
      {
        questionId: '123e4567-e89b-12d3-a456-426614174001',
        selectedAnswer: 'b',
      },
    ], // Example structure of the answers array
  })
  @ArrayMinSize(1) // At least one answer should be included
  @ValidateNested({ each: true }) // Each item in the array should be validated as an AnswerDto
  @Type(() => AnswerDto) // Use AnswerDto to transform the array elements
  answers: AnswerDto[];
}
