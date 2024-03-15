import { Quiz, Subscription, User } from "@prisma/client";

export type UserDataType = User & { Subscription: Subscription[] }
//   | { error: string };

export interface QuizDetail extends Quiz {
  createdBy: User;
}

export type QuizDetailType = QuizDetail | { error: string };
