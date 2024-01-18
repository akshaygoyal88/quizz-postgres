"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Textarea from "../Shared/Textarea";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import QuestionForm from "./QuestionForm";

interface availableSetTypes {
  name: string;
}

function EditQuesForm({ quesId }: { quesId: string }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [description, setDescription] = useState("");
  const [availableSets, setAvailableSets] = useState<availableSetTypes[]>([]);
  const [defaultQuestionSet, setDefaultQuestionSet] = useState<object | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState("0");
  const [setId, setSetId] = useState<string | null>(null);
  const {
    data: questionData,
    error: questionError,
    isLoading: questionIsLoading,
  } = useFetch({
    url: `${pathName.questionsApiPath.path}/${quesId}`,
  });

  const {
    data: questionSetsData,
    error: questionSetsError,
    isLoading: questionSetsIsLoading,
  } = useFetch({
    url: `${pathName.questionSetApi.path}`,
  });

  useEffect(() => {
    if (questionData && !questionData.error) {
      setQuestion(questionData?.question_text);
      // setDefaultQuestionSet(questionData?.questionSets[0].name);
      setQuestionType(questionData?.type);
      const initialOptions = questionData?.objective_options.map(
        (opt: { text: any }) => opt.text
      );
      setOptions(initialOptions);
      const correctAnswerIndex = questionData?.objective_options.findIndex(
        (opt: { isCorrect: any }) => opt.isCorrect
      );
      setCorrectAnswer(correctAnswerIndex);
      const des = questionData?.subjective_description.map(
        (ds: { description: any }) => ds.description
      );
      setDescription(des);
      setTimer(questionData?.timer);
    } else if (questionData?.error) {
      setValidationError(questionData?.error);
    }
  }, [questionData]);

  useEffect(() => {
    if (questionSetsData) {
      setAvailableSets([...questionSetsData]);
    }
  }, [questionSetsData]);

  const handleRadioChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setQuestionType(event.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleOptionChange = (index: any) => {
    setCorrectAnswer(index);
    setValidationError("");
  };

  const handleOptionTextChange = (index: any, option: any) => {
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
  };

  const handleSaveQuestion = async () => {
    let requestData;

    if (questionType === "OBJECTIVE") {
      if (
        question.trim() === "" ||
        options.some((option) => option.trim() === "")
      ) {
        setValidationError(
          "Please fill in both the question and options before saving."
        );
        return;
      }

      if (correctAnswer === null) {
        setValidationError("Please select the correct answer.");
        return;
      }
      requestData = {
        question_text: question,
        options: [...options],
        type: "OBJECTIVE",
        correctAnswer: correctAnswer,
        // questionSet: questionSet,
        timer: timer,
        setId,
      };
    } else if (questionType === "SUBJECTIVE") {
      requestData = {
        question_text: question,
        type: "SUBJECTIVE",
        description: description,
        // questionSet: questionSet,
        timer: timer,
        setId,
      };
    }

    const {
      data: editQuesRes,
      error: editQuesError,
      isLoading: editQuesIsLoading,
    } = await fetchData({
      url: `${pathName.questionsApiPath.path}/${quesId}`,
      method: FetchMethodE.PUT,
      body: requestData,
    });

    if (!editQuesError && !editQuesRes?.error) {
      setSuccessMessage("Successfully Updated!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
    } else if (editQuesRes?.error) {
      setValidationError(editQuesRes?.error);
    } else {
      setValidationError(editQuesError);
    }
  };

  // const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTimer(Number(e.target.value));
  // };

  const handletQuesSetChange = (quesSetId: string) => {
    setValidationError("");
    console.log(quesSetId);
    // setQuestionSet(set);
    setSetId(quesSetId);
  };
  const handletQueChange = (que: string) => {
    setValidationError("");
    setQuestion(que);
  };
  const handletTimerChange = (time: string) => {
    setValidationError("");
    setTimer(time);
  };

  return (
    <QuestionForm
      question={question}
      options={options}
      correctAnswer={correctAnswer}
      validationError={validationError}
      questionType={questionType}
      description={description}
      defaultQuestionSet={defaultQuestionSet}
      timer={timer}
      successMessage={successMessage}
      data={availableSets}
      headingText="Edit Questions"
      buttonText="Edit"
      handleRadioChange={handleRadioChange}
      handleOptionTextChange={handleOptionTextChange}
      handleDescriptionChange={handleDescriptionChange}
      handleOptionChange={handleOptionChange}
      handleSaveQuestion={handleSaveQuestion}
      handletQuesSetChange={handletQuesSetChange}
      handletQueChange={handletQueChange}
      handletTimerChange={handletTimerChange}
    />
  );
}

export default EditQuesForm;
