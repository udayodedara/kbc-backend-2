import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Read quotes from JSON file
const quotes = JSON.parse(fs.readFileSync(__dirname + '/data/quotes.json', 'utf-8'));

async function seedQuotes() {
  for (const quote of quotes) {
    await prisma.quotes.create({
      data: {
        text: quote.quote,
        author: quote.author,
      },
    });
  }

  console.log('✅ Quotes seeded successfully!');
}

async function main() {
  await seedQuotes();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
