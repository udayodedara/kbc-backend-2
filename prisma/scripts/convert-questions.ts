import * as fs from 'fs';
import * as path from 'path';


// this file is to convert the question taken from git

interface RawQuestion {
  question: string;
  category: string;
  answer: string;
  choices: string[];
}

interface FormattedQuestion {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answer: string;
  answer_string: string;
  difficulty_level: number;
  categoryName: string;
}

const defaultDifficulty = 1;
const defaultCategory = 'General Knowledge';
const outputFilePath = 'question2.json';

function convertQuestion(item: RawQuestion): FormattedQuestion | null {
  if (!item.choices || item.choices.length < 4) return null;

  const options = ['a', 'b', 'c', 'd'];
  const choiceMap: { [key: string]: string } = {};
  let answerKey: string | null = null;

  for (let i = 0; i < 4; i++) {
    const optionKey = options[i];
    const choice = item.choices[i];
    choiceMap[optionKey] = choice;

    if (choice === item.answer) {
      answerKey = optionKey;
    }
  }

  if (!answerKey) return null;

  return {
    question: item.question,
    a: choiceMap.a,
    b: choiceMap.b,
    c: choiceMap.c,
    d: choiceMap.d,
    answer: answerKey,
    answer_string: item.answer,
    difficulty_level: defaultDifficulty,
    categoryName: defaultCategory
  };
}

function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error('❌ Please provide input file path. Example:\n   npx ts-node convert-questions.ts ./input.json');
    process.exit(1);
  }

  try {
    const inputJson = fs.readFileSync(path.resolve(inputPath), 'utf8');
    const rawQuestions: RawQuestion[] = JSON.parse(inputJson);

    const formattedQuestions = rawQuestions
      .map(convertQuestion)
      .filter((q): q is FormattedQuestion => q !== null);

    fs.writeFileSync(
      path.resolve(outputFilePath),
      JSON.stringify(formattedQuestions, null, 2),
      'utf8'
    );

    console.log(`✅ Converted ${formattedQuestions.length} questions to ${outputFilePath}`);
  } catch (err) {
    console.error('❌ Error reading or converting file:', (err as Error).message);
  }
}

main();
