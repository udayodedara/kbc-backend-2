import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAvatars() {
  const avatars = [
    { image: 'avatar9.png', isAvailable: true },
    { image: 'avatar10.png', isAvailable: true },
    { image: 'avatar11.png', isAvailable: true },
    { image: 'avatar12.png', isAvailable: true },
    { image: 'avatar13.png', isAvailable: true },
    { image: 'avatar14.png', isAvailable: true },
    { image: 'avatar15.png', isAvailable: true },
    { image: 'avatar16.png', isAvailable: true },
    { image: 'avatar17.png', isAvailable: true },
    { image: 'avatar18.png', isAvailable: true },
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
