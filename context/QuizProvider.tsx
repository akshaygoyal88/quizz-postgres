import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { Question } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState } from "react";

export const QuizContext = createContext({
  questionSet: [],
  handleQuestionSet: () => {},
});

const QuizProvider = ({ children }) => {
  const [questionSet, setQuestionSet] = useState([]);
  const ses = useSession();
  const handleQuestionSet = async ({
    quesArr,
    quizId,
  }: {
    quesArr: [];
    quizId?: string;
  }) => {
    console.log(quesArr);
    if (quesArr.length > 0) {
      setQuestionSet(quesArr);
      // if (ses.status === "authenticated") {
      //   let initializeQues = [];
      //   for (let que of quesArr) {
      //     console.log(que);
      //     initializeQues.push({
      //       submittedBy: ses.data.id,
      //       setId: quizId,
      //       questionId: que.id,
      //     });
      //   }
      //   const { data, error, isLoading } = await fetchData({
      //     url: `${pathName.quizAnsApi.path}`,
      //     method: FetchMethodE.POST,
      //     body: initializeQues,
      //   });
      // }
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
