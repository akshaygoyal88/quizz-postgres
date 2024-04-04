import {
  AnswerTypeE,
  ObjectiveOptions,
  Question,
  QuestionType,
  Quiz,
  Subscription,
  User,
  UserQuizAnswerStatus,
  UserQuizAnswers,
  UserQuizReport,
} from "@prisma/client";
import { ChangeEvent, ReactNode } from "react";

export type UserDataType = User & { Subscription: Subscription[] };

export interface QuizDetail extends Quiz {
  createdBy: User;
}

export type QuizDetailType = QuizDetail | { error?: string };

export interface QuesType extends Question {
  timer: number;
  objective_options: ObjectiveOptions[];
}
export type QuestionsTypes =
  | ({
      objective_options?: {
        id: string;
        text: string;
        isCorrect: boolean;
        questionId: string;
        option_marks: number | null
      }[];
    } & {
      id: string;
      question_text: string | null;
      type: QuestionType;
      timer: number;
      answer_type: AnswerTypeE | null;
      status: UserQuizAnswerStatus;
      editorContent: string | null;
      createdBy?: User;
      createdAt?: Date;
      updatedAt?: Date;
      solution?: string;
    })
  | ({
      objective_options: {
        id: string;
        text: string;
        isCorrect: boolean;
        questionId: string;
        option_marks: number | null
      }[];
    } & {
      id: string;
      question_text: string | null;
      type: QuestionType;
      timer: number;
      answer_type: AnswerTypeE | null;
      status?: UserQuizAnswerStatus;
      editorContent: string | null;
      createdBy?: User;
      createdAt?: Date;
      updatedAt?: Date;
      solution?: string;
    })
  | null;

export interface UserQuizAnsType extends UserQuizAnswers {
  question: QuesType | null;
}

export interface CandidateResponseTypes extends UserQuizReport {
  marks: any;
  ans_subjective: string | null;
  ans_optionsId: string;
  isCorrect: any;
  timeTaken: string;
  question: QuestionsTypes;
  objective_options: ObjectiveOptions[];
}

export interface InputTypesProps {
  type: string;
  name?: string;
  label?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  value?: string | number | undefined;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  errors?: string;
  maxLength?: number;
  otherText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  min?: string | number;
  impAsterisk?: string;
  step?: string;
  selecItems?: { value: string; title: string }[];
  selectHeading?: string;
  columnClass?: string;
  accept?: string;
}

export interface imageS3 {
  title: string;
  value: string;
}

export interface UserQuizReportTypes extends UserQuizReport {
  submittedBy?: string;
  name: ReactNode;
  user: User;
}

export interface SubscriptionTypes extends Subscription {
  user: User;
}
