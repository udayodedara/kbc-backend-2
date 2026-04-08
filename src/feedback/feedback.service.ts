import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}
  async addFeedback(createFeedbackDto: CreateFeedbackDto) {
    const { userId, questionId, feedback } = createFeedbackDto;

    // Ensure the user exists
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // If questionId is provided, ensure the question exists
    if (questionId) {
      const question = await this.prisma.questions.findUnique({
        where: { id: questionId },
      });
      if (!question) {
        throw new NotFoundException('Question not found.');
      }
    }

    // Save feedback in database
    return this.prisma.feedback.create({
      data: {
        userId,
        questionId: questionId || null, // Store null if it's general feedback
        feedback,
      },
    });
  }
}
