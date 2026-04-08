import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  const categories = [
    {
      name: 'General Knowledge',
      image: 'general_knowledge.png',
      isAvailable: true,
    },
    {
      name: 'Current Affairs',
      image: 'current_affairs.png',
      isAvailable: true,
    },
    { name: 'Art & Culture', image: 'art_culture.png', isAvailable: true },
    { name: 'Constitution', image: 'constitution.png', isAvailable: true },
    { name: 'Economy', image: 'economy.png', isAvailable: true },
    { name: 'English', image: 'english.png', isAvailable: true },
    { name: 'Entertainment', image: 'entertainment.png', isAvailable: true },
    { name: 'Geography', image: 'geography.png', isAvailable: true },
    { name: 'History', image: 'history.png', isAvailable: true },
    { name: 'Nature', image: 'nature.png', isAvailable: true },
    { name: 'Science', image: 'science.png', isAvailable: true },
    { name: 'Sports', image: 'sports.png', isAvailable: true },
    { name: 'Technology', image: 'technology.png', isAvailable: true },
  ];

  let sortIndex = 1;
  for (const category of categories) {
    await prisma.categories.create({
      data: {
        name: category.name,
        image: category.image,
        isAvailable: category.isAvailable,
        sortIndex: sortIndex++,
      },
    });
  }

  console.log('✅ Categories seeded successfully!');
}

async function main() {
  await seedCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
