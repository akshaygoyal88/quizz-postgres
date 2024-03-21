import { AnswerTypeE, ObjectiveOptions, Question, QuestionType, Quiz, Subscription, User, UserQuizAnswerStatus, UserQuizAnswers, UserQuizReport } from "@prisma/client";

export type UserDataType = User & { Subscription: Subscription[] }

export interface QuizDetail extends Quiz {
  createdBy: User;
}

export type QuizDetailType = QuizDetail | { error: string };



export interface QuesType extends Question {
  objective_options?: ObjectiveOptions[];
}
export type QuestionsTypes =
| ({
    objective_options?: {
      id: string;
      text: string;
      isCorrect: boolean;
      questionId: string;
    }[];
  } & {
    id: string;
    question_text: string | null;
    type: QuestionType;
    timer: number;
    answer_type: AnswerTypeE | null;
    status: UserQuizAnswerStatus;
    editorContent: string | null; 
  })
| ({
    objective_options: {
      id: string;
      text: string;
      isCorrect: boolean;
      questionId: string;
    }[];
  } & {
    id: string;
    question_text: string | null;
    type: QuestionType;
    timer: number;
    answer_type: AnswerTypeE | null;
    status?: UserQuizAnswerStatus;
    editorContent: string | null; 
  })
| null;


export interface UserQuizAnsType extends UserQuizAnswers {
  question: QuesType | null;
}


export interface CandidateResponseTypes extends UserQuizReport {
  ans_subjective: string | null;
  ans_optionsId: string;
  isCorrect: any;
  timeTaken: string;
  question: QuestionsTypes;
}