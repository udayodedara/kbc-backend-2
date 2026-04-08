import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Read questions from JSON file
const questions = JSON.parse(
  fs.readFileSync(__dirname + '/data/generalKnowledge.json', 'utf-8'),
);

async function seedQuestions() {
  for (const question of questions) {
    const category = await prisma.categories.findUnique({
      where: { name: question.categoryName },
    });
    
    if (!category) {
      console.warn(
        `⚠️ Category '${question.categoryName}' not found. Skipping question.`,
      );
      continue;
    }

    await prisma.questions.create({
      data: {
        question: question.question,
        a: question.a,
        b: question.b,
        c: question.c,
        d: question.d,
        correctAnswer: question.answer,
        correctAnswerText: question.answer_string,
        difficultyLevel: question.difficulty_level,
        categoryId: category.id,
      },
    });
  }

  console.log('✅ Questions seeded successfully!');
}

async function main() {
  await seedQuestions();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
