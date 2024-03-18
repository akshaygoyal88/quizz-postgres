import { ObjectiveOptions, Question, Quiz, Subscription, User, UserQuizAnswers } from "@prisma/client";

export type UserDataType = User & { Subscription: Subscription[] }
//   | { error: string };

export interface QuizDetail extends Quiz {
  createdBy: User;
}

export type QuizDetailType = QuizDetail | { error: string };

export interface UserQuizAnsType extends UserQuizAnswers {
  question: Question;
}

export interface QuesType extends Question {
  objective_options?: ObjectiveOptions[]
}
