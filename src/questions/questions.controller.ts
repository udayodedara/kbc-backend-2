import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { Cron } from '@nestjs/schedule';
import { BookmarkQuestionDto } from './dto/bookmark-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getQuestions(
    @Query('userId') userId: string,
    @Query('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.questionsService.getUniqueQuestionsForUser(userId, categoryId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submitAnswers(@Body() submitAnswersDto: SubmitAnswersDto) {
    return this.questionsService.submitAnswers(submitAnswersDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('leaderboard')
  async getLeaderboard(@Query('period') period: string) {
    // Convert period to number and validate
    const periodNumber = parseInt(period, 10);
    if (![0, 1, 2].includes(periodNumber)) {
      throw new BadRequestException(
        'Invalid period. Use 0 for today, 1 for week, 2 for month.',
      );
    }

    return await this.questionsService.getLeaderboard(periodNumber);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('daily')
  async getDailyQuiz(@Query('userId') userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return await this.questionsService.getDailyQuiz(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('guest')
  async getQuestionsForGuest() {
    return this.questionsService.getRandomQuestionsForGuest();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('submit-daily')
  async submitDailyQuiz(@Body() submitAnswersDto: SubmitAnswersDto) {
    return await this.questionsService.submitDailyQuiz(submitAnswersDto);
  }

  @Cron('58 23 * * *')
  @Get('reset-daily-quiz')
  async resetDailyQuizManually() {
    console.log('daily quiz reset');
    this.questionsService.resetDailyQuiz();
    return 'Daily quiz status reset successfully!';
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('bookmark')
  async bookmarkQuestion(@Body() dto: BookmarkQuestionDto) {
    return await this.questionsService.bookmarkQuestion(
      dto.userId,
      dto.questionId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('bookmarked')
  async getBookmarkedQuestions(@Query('userId') userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return await this.questionsService.getBookmarkedQuestions(userId);
  }

  @Patch('remove-bookmark')
  async removeBookmark(@Body() body: BookmarkQuestionDto) {
    return this.questionsService.removeBookmark(body.userId, body.questionId);
  }

  @Get('questionsById')
  async getQuestionsById(@Query('questionId') questionId: string) {
    if (!questionId) {
      throw new Error('Question ID is required');
    }
    return await this.questionsService.getQuestionById(questionId);
  }

  @Get('practice-questions')
  async getQuestionsByCategory(
    @Query('categoryId', ParseIntPipe) categoryId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('row', ParseIntPipe) row: number,
  ) {
    return this.questionsService.getQuestionsByCategory(categoryId, page, row);
  }
}
