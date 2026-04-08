import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAvatars() {
  const avatars = [
    { image: 'avatar1.png', isAvailable: true },
    { image: 'avatar2.png', isAvailable: true },
    { image: 'avatar3.png', isAvailable: true },
    { image: 'avatar4.png', isAvailable: true },
    { image: 'avatar5.png', isAvailable: true },
    { image: 'avatar6.png', isAvailable: true },
    { image: 'avatar7.png', isAvailable: true },
    { image: 'avatar8.png', isAvailable: true },
  ];

  for (const avatar of avatars) {
    await prisma.avatar.create({
      data: {
        image: avatar.image,
        isAvailable: avatar.isAvailable,
      },
    });
  }

  console.log('✅ Avatars seeded successfully!');
}

async function main() {
  await seedAvatars();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
