import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}
  async getUniqueQuestionsForUser(userId: string, categoryId?: number) {
    try {
      // 1. Get answered questions by the user
      const answeredQuestions = await this.prisma.userQuestionHistory.findMany({
        where: { userId },
        select: { questionId: true },
      });

      const answeredIds = answeredQuestions.map((q) => q.questionId);

      // 2. Prepare filter
      const questionFilter: {
        id: { notIn: string[] };
        isAvailable: boolean;
        categoryId?: number;
      } = {
        id: { notIn: answeredIds },
        isAvailable: true,
      };

      if (categoryId !== undefined) {
        questionFilter.categoryId = categoryId;
      }

      // 3. Fetch initial questions
      let questions = await this.prisma.questions.findMany({
        where: questionFilter,
        take: 10,
        orderBy: { difficultyLevel: 'asc' },
      });

      // 4. Fill with more if less than 10
      if (questions.length < 10) {
        const remaining = 10 - questions.length;

        const extraFilter: {
          isAvailable: boolean;
          categoryId?: number;
        } = { isAvailable: true };

        if (categoryId !== undefined) {
          extraFilter.categoryId = categoryId;
        }

        const extraQuestions = await this.prisma.questions.findMany({
          where: extraFilter,
          take: remaining,
        });

        questions = [...questions, ...extraQuestions];
      }

      // 5. Get user's bookmarked question IDs
      const bookmarked = await this.prisma.bookmarkedQuestion.findMany({
        where: {
          userId,
          isAvailable: true,
        },
        select: {
          questionId: true,
        },
      });

      const bookmarkedIds = new Set(bookmarked.map((b) => b.questionId));

      // 6. Add `isBookmarked` field to each question
      const questionsWithBookmarkStatus = questions.map((q) => ({
        ...q,
        isBookmarked: bookmarkedIds.has(q.id),
      }));

      return questionsWithBookmarkStatus;
    } catch (error) {
      console.error('Get Unique Questions Error:', error);
      throw error;
    }
  }

  async submitAnswers(submitAnswersDto: SubmitAnswersDto) {
    try {
      const { userId, answers } = submitAnswersDto;

      const results: { questionId: string; isCorrect: boolean }[] = [];

      const appConfig = await this.prisma.appConfig.findFirst();

      const pointsPerCorrectAnswer = appConfig?.quizPoints ?? 1;

      console.log(
        'Points per correct answer from app config:',
        pointsPerCorrectAnswer,
      );

      let correctAnswersCount = 0;

      for (const answer of answers) {
        const { questionId, selectedAnswer } = answer;

        const question = await this.prisma.questions.findUnique({
          where: { id: questionId },
        });

        if (!question) {
          throw new Error(`Question with ID ${questionId} not found`);
        }
        console.log('selectedAnswer', selectedAnswer);
        console.log('question.correctAnswer', question.correctAnswer);
        const isCorrect = selectedAnswer === question.correctAnswer;

        if (isCorrect) {
          correctAnswersCount++;
        }

        await this.prisma.userQuestionHistory.create({
          data: {
            userId,
            questionId,
            isCorrect,
          },
        });

        results.push({
          questionId,
          isCorrect,
        });
      }

      const totalPoints = correctAnswersCount * pointsPerCorrectAnswer;
     
      await this.prisma.users.update({
        where: { id: userId },
        data: {
          totalQuizPlayed: { increment: 1 },
        },
      });
      
      return {
        results,
        message: `${totalPoints} stamps added`,
        correctAnswersCount,
        totalPoints,
      };
    } catch (error) {
      console.error('Verify OTP Error:', error);
      throw error;
    }
  }

  async getLeaderboard(period: number) {
    try {
      let startDate: Date;

      // Determine the start date based on the period
      if (period === 0) {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Start of today
      } else if (period === 1) {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); // 7 days ago
      } else if (period === 2) {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // 30 days ago
      } else {
        throw new BadRequestException(
          'Invalid period. Use 0 for today, 1 for week, 2 for month.',
        );
      }

      // Fetch all relevant transactions (ADD and REMOVE) within the specified period
      const transactions = await this.prisma.stampTransaction.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
          type: {
            in: ['ADD', 'REMOVE'], // Include both ADD and REMOVE types
          },
        },
      });

      // Calculate net points for each user
      const userPoints: { [userId: string]: number } = {};

      transactions.forEach((transaction) => {
        const { userId, type, count } = transaction;
        if (!userPoints[userId]) {
          userPoints[userId] = 0;
        }
        // Add points for ADD transactions, subtract for REMOVE
        userPoints[userId] += type === 'ADD' ? count : -count;
      });

      // Filter out users with 0 points
      const topUsers = Object.entries(userPoints)
        .map(([userId, netPoints]) => ({ userId, netPoints }))
        .filter((entry) => entry.netPoints >= 0) // Exclude users with 0 points
        .sort((a, b) => b.netPoints - a.netPoints) // Sort by net points in descending order
        .slice(0, 50); // Take the top 10 users

      // Fetch user details for the top users
      const userIds = topUsers.map((user) => user.userId);
      const users = await this.prisma.users.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          firstName: true,
          avatar: {
            select: {
              image: true,
            },
          },
          availableStamps: true,
        },
      });

      // Combine user details with their net points
      const leaderboard = topUsers.map((entry) => {
        const user = users.find((u) => u.id === entry.userId);
        return {
          userId: entry.userId,
          username: user?.firstName || 'Unknown',
          netPoints: entry.netPoints,
          avatarImage: user?.avatar?.image || null,
          availableStamps: user?.availableStamps || 0,
        };
      });

      return leaderboard;
    } catch (error) {
      console.error('Get Leaderboard Error:', error);
      throw error;
    }
  }

  async getDailyQuiz(userId: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (user?.hasPlayedDailyQuiz || false) {
        throw new BadRequestException(
          'You have already played the daily quiz.',
        );
      }

      const questions = await this.prisma.questions.findMany({
        where: { isAvailable: true },
      });

      const shuffledQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

      return shuffledQuestions;
    } catch (error) {
      console.error('Daily Quiz Error:', error);
      throw error;
    }
  }

  async submitDailyQuiz(submitAnswersDto: SubmitAnswersDto) {
    try {
      const { userId, answers } = submitAnswersDto;

      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (user?.hasPlayedDailyQuiz || false) {
        throw new BadRequestException(
          'You have already played the daily quiz.',
        );
      }

      const appConfig = await this.prisma.appConfig.findFirst();

      const pointsPerCorrectAnswer = appConfig?.dailyQuizPoints ?? 2;

      console.log(
        'Points per correct answer from app config:',
        pointsPerCorrectAnswer,
      );
      let correctAnswersCount = 0;

      for (const answer of answers) {
        const { questionId, selectedAnswer } = answer;

        const question = await this.prisma.questions.findUnique({
          where: { id: questionId },
          select: { correctAnswer: true },
        });

        if (!question) {
          throw new Error(`Question with ID ${questionId} not found`);
        }

        const isCorrect = selectedAnswer === question.correctAnswer;

        if (isCorrect) {
          correctAnswersCount++;
        }
      }

      const totalPoints = correctAnswersCount * pointsPerCorrectAnswer;

      await this.prisma.users.update({
        where: { id: userId },
        data: {
          totalQuizPlayed: { increment: 1 },
          hasPlayedDailyQuiz: true,
        },
      });

      return {
        correctAnswersCount,
        totalPoints,
        message: `You earned ${totalPoints} points!`,
      };
    } catch (error) {
      console.error('Submit Daily Quiz Error:', error);
      throw error;
    }
  }

  async resetDailyQuiz() {
    try {
      await this.prisma.users.updateMany({
        data: { hasPlayedDailyQuiz: false },
      });

      return 'Daily quiz status reset successfully!';
    } catch (error) {
      console.error('Error resetting daily quiz status:', error);
      throw error;
    }
  }

  async bookmarkQuestion(userId: string, questionId: string) {
    try {
      const existing = await this.prisma.bookmarkedQuestion.findFirst({
        where: { userId, questionId },
      });

      if (existing) {
        throw new BadRequestException(
          'You have already bookmarked this question.',
        );
      }

      await this.prisma.bookmarkedQuestion.create({
        data: {
          userId,
          questionId,
        },
      });

      return 'Question bookmarked successfully.';
    } catch (error) {
      console.error('Bookmark Question Error:', error);
      if (error.code === 'P2002') {
        throw new BadRequestException('Duplicate bookmark not allowed.');
      }
      throw error;
    }
  }

  async getBookmarkedQuestions(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.prisma.bookmarkedQuestion.findMany({
      where: { userId, isAvailable: true },
      include: {
        question: true,
      },
    });
  }

  async removeBookmark(userId: string, questionId: string) {
    console.log('userId', userId);
    console.log('question ID', questionId);
    const bookmark = await this.prisma.bookmarkedQuestion.findFirst({
      where: {
        userId,
        questionId,
        isAvailable: true,
      },
    });

    if (!bookmark) {
      throw new BadRequestException('Bookmark not found or already removed');
    }

    await this.prisma.bookmarkedQuestion.delete({
      where: { id: bookmark.id },
    });

    return 'Bookmark removed successfully';
  }

  async getQuestionById(questionId: string) {
    try {
      const question = await this.prisma.questions.findUnique({
        where: { id: questionId },
      });

      if (!question) {
        throw new BadRequestException('Question not found');
      }

      return question;
    } catch (error) {
      console.error('Get Question By ID Error:', error);
      throw error;
    }
  }

  async getRandomQuestionsForGuest(categoryId?: number) {
    try {
      // 1. Prepare filter
      const questionFilter: {
        isAvailable: boolean;
        categoryId?: number;
      } = {
        isAvailable: true,
      };

      if (categoryId !== undefined) {
        questionFilter.categoryId = categoryId;
      }

      // 2. Fetch more questions and shuffle for randomness
      const allQuestions = await this.prisma.questions.findMany({
        where: questionFilter,
        // take: 50, // Fetch more to shuffle and pick from
      });

      // 3. Shuffle and pick 10 random questions
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const randomQuestions = shuffled.slice(0, 10);

      return randomQuestions;
    } catch (error) {
      console.error('Get Random Guest Questions Error:', error);
      throw error;
    }
  }

  async getQuestionsByCategory(
    categoryId: number = 0,
    page: number = 1,
    row: number = 10,
  ) {
    try {
      // const { categoryId, page = 1, row = 10 } = getPracticeQuestionsDto;
      const skip = (page - 1) * row;

      const questions = await this.prisma.questions.findMany({
        where: {
          isAvailable: true,
          categoryId,
        },
        orderBy: {
          difficultyLevel: 'asc',
        },
        skip,
        take: row,
      });

      const total = await this.prisma.questions.count({
        where: {
          isAvailable: true,
          categoryId,
        },
      });

      return {
        questions,
        pagination: {
          page,
          row,
          total,
          totalPages: Math.ceil(total / row),
        },
      };
    } catch (error) {
      console.error('Get Questions By Category For Practice Error:', error);
      throw error;
    }
  }
}
