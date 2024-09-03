<<<<<<< Updated upstream
import { hash } from "bcrypt";
import { db } from "../db";
import { AnswerTypeE, QuestionType, QuizCreationStatusE, UserRole } from "@prisma/client";

function mathRandom(operation: string, start: number, end: number) {
  let result = [];

  function generateOptions(correctAnswer: number) {
    const options = [`${correctAnswer}`];
    const ans = `${correctAnswer}`;

    while (options.length < 4) {
      const randomOption = `${Math.floor(Math.random() * 100)}`;
      if (randomOption !== ans) {
        options.push(randomOption);
      }
    }

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return options;
  }

  if (operation === "+" || operation === "*") {
    for (let i = start; i <= end; i++) {
      for (let j = i; j <= end; j++) {
        const options = generateOptions(eval(`${i} ${operation} ${j}`));
        result.push({
          editorContent: `${i} ${operation} ${j}`,
          options,
          correctAnswer: options.indexOf(`${eval(`${i} ${operation} ${j}`)}`),
        });
      }
    }
  } else if (operation === "-" || operation === "/") {
    for (let i = start; i <= end; i++) {
      for (let j = i; j <= end; j++) {
        const options = generateOptions(eval(`${j} ${operation} ${i}`));
        result.push({
          editorContent: `${j} ${operation} ${i}`,
          options,
          correctAnswer: options.indexOf(`${eval(`${j} ${operation} ${i}`)}`),
=======
const { hash } = require("bcrypt");
const {
  PrismaClient,
  AnswerTypeE,
  QuestionType,
  QuizCreationStatusE,
  UserRole,
} = require("@prisma/client");

const prisma = new PrismaClient();

function mathRandom(operation: string, start: number, end: number) {
  const result = [];

  function generateOptions(correctAnswer: number) {
    const options = [correctAnswer];
    while (options.length < 4) {
      const randomOption = Math.floor(Math.random() * 100);
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    return options;
  }

  if (["+", "*"].includes(operation)) {
    for (let i = start; i <= end; i++) {
      for (let j = i; j <= end; j++) {
        const correctAnswer = operation === "+" ? i + j : i * j;
        const options = generateOptions(correctAnswer);
        result.push({
          editorContent: `${i} ${operation} ${j}`,
          options: options.map(String),
          correctAnswer: options.indexOf(correctAnswer),
        });
      }
    }
  } else if (["-", "/"].includes(operation)) {
    for (let i = start; i <= end; i++) {
      for (let j = i; j <= end; j++) {
        const correctAnswer = operation === "-" ? i - j : i / j;
        const options = generateOptions(correctAnswer);
        result.push({
          editorContent: `${i} ${operation} ${j}`,
          options: options.map(String),
          correctAnswer: options.indexOf(correctAnswer),
>>>>>>> Stashed changes
        });
      }
    }
  }
  return result;
}

async function main() {
  const password = await hash("Admin@123", 10);

  const userCreate = await prisma.user.create({
    data: {
      email: "admin@codecaffiene.com",
      password,
      isActive: true,
      isVerified: true,
      first_name: "Admin",
      last_name: "codecaffiene",
      role: UserRole.SUPERADMIN,
      mobile_number: "+91XXXXXXXXX",
      address: "cyx",
      country: "India",
      state: "MP",
      city: "Indore",
      pincode: "000000",
      isProfileComplete: true,
    },
  });

<<<<<<< Updated upstream
  const createQuiz = await db.quiz.create({
    data: {
      name: "Maths",
      createdBy: {
        connect: {
          id: userCreate.id,
=======
  const createQuiz = await prisma.quiz.create({
    data: {
      name: "Maths",
      createdBy: {
        connect: { id: userCreate.id },
      },
      status: QuizCreationStatusE.FREE,
    },
  });

  const queArray: {
    editorContent: string;
    options: string[];
    correctAnswer: number;
  }[] = [];
  queArray.push(...mathRandom("+", 7, 8));
  queArray.push(...mathRandom("-", 5, 6));
  queArray.push(...mathRandom("/", 4, 5));
  queArray.push(...mathRandom("*", 6, 7));

  // Multiple choice question
  const addMulQuestion = await prisma.question.create({
    data: {
      editorContent: `What is the result of the problem <strong>6 + 4</strong>?`,
      type: QuestionType.OBJECTIVE,
      timer: 50,
      objective_options: {
        createMany: {
          data: [
            { text: "Ten", isCorrect: true, option_marks: 2 },
            { text: "10", isCorrect: true, option_marks: 2 },
            { text: "5", isCorrect: false, option_marks: -1 },
            { text: "None of the above", isCorrect: false, option_marks: -1 },
          ],
>>>>>>> Stashed changes
        },
      },
<<<<<<< Updated upstream
      status: QuizCreationStatusE.FREE
    },
  });

  const result = [];
  const queArray: { editorContent: string; options: string[]; correctAnswer: number }[]
     = [];
  queArray.push(...mathRandom("+", 7, 8));
  queArray.push(...mathRandom("-", 5, 6));
  queArray.push(...mathRandom("/", 4, 5));
  queArray.push(...mathRandom("*", 6, 7));

  //Multiple select type
  const addMulQuestion = await db.question.create({
    data: {
      editorContent: `What is Result of Given problem <strong>6+4?<strong>`,
      type: QuestionType.OBJECTIVE,
      timer: parseInt(`${50}`, 10),
      objective_options: {
        createMany: {
          data: ["Ten", "10", "5", "none of above"].map(
            (option: string, index: number) => ({
              text: option,
              isCorrect: [0, 1].includes(index),
              option_marks: [0, 1].includes(index) ? 2 : -1,
            })
          ),
        },
      },
      answer_type: AnswerTypeE.MULTIPLECHOICE,
      createdById: userCreate.id,
    },
  });
  result.push(addMulQuestion);

  await db.quizQuestions.createMany({
    data: {
      quizId: createQuiz.id,
      questionId: addMulQuestion.id,
      createdBy: userCreate.id,
    },
  });

  //subjectvie type
  const addSubQuestion = await db.question.create({
    data: {
      editorContent: `64 men can complete a piece of work in 40 days. In how many days can 32 men complete the same piece of work?`,
      type: QuestionType.SUBJECTIVE,
      objective_options: {
        createMany: {
          data: {
            text: "",
            isCorrect: false,
            option_marks: 5,
          },
        },
      },
      createdById: userCreate.id,
    },
  });
  result.push(addSubQuestion);

  await db.quizQuestions.createMany({
    data: {
      quizId: createQuiz.id,
      questionId: addSubQuestion.id,
      createdBy: userCreate.id,
    },
  });

  for (let i = 0; i < queArray.length; i++) {
    const addQuestion = await db.question.create({
      data: {
        editorContent: `What is Result of Given problem <strong>${queArray[i].editorContent}?<strong>`,
        type: QuestionType.OBJECTIVE,
        timer: parseInt(`${50}`, 10),
        objective_options: {
          createMany: {
            data: queArray[i].options.map((option: string, index: number) => ({
              text: option,
              isCorrect: [queArray[i].correctAnswer].includes(index),
              option_marks: [queArray[i].correctAnswer].includes(index) ? 2 : 0,
            })),
          },
        },
=======
      answer_type: AnswerTypeE.MULTIPLECHOICE,
      createdById: userCreate.id,
    },
  });

  await prisma.quizQuestions.create({
    data: {
      quizId: createQuiz.id,
      questionId: addMulQuestion.id,
      createdBy: userCreate.id,
    },
  });

  // Subjective question
  const addSubQuestion = await prisma.question.create({
    data: {
      editorContent: `64 men can complete a piece of work in 40 days. In how many days can 32 men complete the same piece of work?`,
      type: QuestionType.SUBJECTIVE,
      objective_options: {
        createMany: {
          data: [{ text: "", isCorrect: false, option_marks: 5 }],
        },
      },
      createdById: userCreate.id,
    },
  });

  await prisma.quizQuestions.create({
    data: {
      quizId: createQuiz.id,
      questionId: addSubQuestion.id,
      createdBy: userCreate.id,
    },
  });

  for (const question of queArray) {
    const addQuestion = await prisma.question.create({
      data: {
        editorContent: `What is the result of the problem <strong>${question.editorContent}</strong>?`,
        type: QuestionType.OBJECTIVE,
        timer: 50,
        objective_options: {
          createMany: {
            data: question.options.map((option, index) => ({
              text: option,
              isCorrect: index === question.correctAnswer,
              option_marks: index === question.correctAnswer ? 2 : 0,
            })),
          },
          answer_type:
            ques.type === QuestionType.OBJECTIVE &&
            Array.isArray(ques.correctOption)
              ? ques.correctOption.length > 1
                ? AnswerTypeE.MULTIPLECHOICE
                : AnswerTypeE.SINGLECHOICE
              : undefined,
          createdById: userCreate.id,
        },
>>>>>>> Stashed changes
        answer_type: AnswerTypeE.SINGLECHOICE,
        createdById: userCreate.id,
      },
    });
<<<<<<< Updated upstream
    result.push(addQuestion);

    const quizAdd = await db.quizQuestions.createMany({
=======

    await prisma.quizQuestions.create({
>>>>>>> Stashed changes
      data: {
        quizId: createQuiz.id,
        questionId: addQuestion.id,
        createdBy: userCreate.id,
      },
    });
  }

<<<<<<< Updated upstream
  
  return result;
=======
  console.log("Seeding completed!");
>>>>>>> Stashed changes
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
<<<<<<< Updated upstream
=======

function mathRandom(operation: string, start: number, end: number) {
  let result = [];

  function generateOptions(correctAnswer: number) {
    const options = [`${correctAnswer}`];
    const ans = `${correctAnswer}`;

    while (options.length < 4) {
      const randomOption = `${Math.floor(Math.random() * 100)}`;
      if (randomOption !== ans) {
        options.push(randomOption);
      }
    }

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return options;
  }

  if (operation === "+" || operation === "*") {
    for (let i = start; i <= end; i++) {
      for (let j = i; j <= end; j++) {
        const options = generateOptions(eval(`${i} ${operation} ${j}`));
        result.push({
          editorContent: `${i} ${operation} ${j}`,
          options,
          correctAnswer: options.indexOf(`${eval(`${i} ${operation} ${j}`)}`),
        });
      }
    }
  } else if (operation === "-" || operation === "/") {
    for (let i = start; i <= end; i++) {
      for (let j = i; j <= end; j++) {
        const options = generateOptions(eval(`${j} ${operation} ${i}`));
        result.push({
          editorContent: `${j} ${operation} ${i}`,
          options,
          correctAnswer: options.indexOf(`${eval(`${j} ${operation} ${i}`)}`),
        });
      }
    }
  }
  return result;
}

// const queArray: {
//   editorContent: string;
//   options: string[];
//   correctAnswer: number;
// }[] = [];
// queArray.push(...mathRandom("+", 7, 8));
// queArray.push(...mathRandom("-", 5, 6));
// queArray.push(...mathRandom("/", 4, 5));
// queArray.push(...mathRandom("*", 6, 7));

//Multiple select type
// const addMulQuestion = await db.question.create({
//   data: {
//     editorContent: `What is Result of Given problem <strong>6+4?<strong>`,
//     type: QuestionType.OBJECTIVE,
//     timer: parseInt(`${50}`, 10),
//     objective_options: {
//       createMany: {
//         data: ["Ten", "10", "5", "none of above"].map(
//           (option: string, index: number) => ({
//             text: option,
//             isCorrect: [0, 1].includes(index),
//             option_marks: [0, 1].includes(index) ? 2 : -1,
//           })
//         ),
//       },
//     },
//     answer_type: AnswerTypeE.MULTIPLECHOICE,
//     createdById: userCreate.id,
//   },
// });
// result.push(addMulQuestion);

// await db.quizQuestions.createMany({
//   data: {
//     quizId: createQuiz.id,
//     questionId: addMulQuestion.id,
//     createdBy: userCreate.id,
//   },
// });

//subjectvie type
// const addSubQuestion = await db.question.create({
//   data: {
//     editorContent: `64 men can complete a piece of work in 40 days. In how many days can 32 men complete the same piece of work?`,
//     type: QuestionType.SUBJECTIVE,
//     objective_options: {
//       createMany: {
//         data: {
//           text: "",
//           isCorrect: false,
//           option_marks: 5,
//         },
//       },
//     },
//     createdById: userCreate.id,
//   },
// });
// result.push(addSubQuestion);

// await db.quizQuestions.createMany({
//   data: {
//     quizId: createQuiz.id,
//     questionId: addSubQuestion.id,
//     createdBy: userCreate.id,
//   },
// });
>>>>>>> Stashed changes
