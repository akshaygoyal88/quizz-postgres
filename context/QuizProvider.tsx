import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { Question } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState } from "react";

export const QuizContext = createContext<{
  questionSet: Question[];
  handleQuestionSet: (data: { quesArr: Question[] }) => void;
}>({
  questionSet: [],
  handleQuestionSet: () => {},
});

const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const [questionSet, setQuestionSet] = useState<Question[]>([]);
  const handleQuestionSet = async ({ quesArr }: { quesArr: Question[] }) => {
    if (quesArr?.length > 0) {
      setQuestionSet(quesArr);
    }
  };
  const contextValue = {
    questionSet: questionSet,
    handleQuestionSet,
  };

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
};

export default QuizProvider;
