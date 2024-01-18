import React, { createContext, useContext, useState } from "react";

export const QuizContext = createContext({
  questionSet: [],
  handleQuestionSet: () => {},
});

const QuizProvider = ({ children }) => {
  const [questionSet, setQuestionSet] = useState([]);
  const handleQuestionSet = (queArr: []) => {
    if (queArr.length > 0) {
      setQuestionSet(queArr);
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
