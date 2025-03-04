"use client";
import { useState, useEffect } from "react";
import {
  AnswerTypeE,
  ObjectiveOptions,
  QuestionType,
  User,
  UserQuizAnswerStatus,
} from "@prisma/client";
import { classNames } from "@/utils/classNames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleAnsSubmission } from "@/action/actionTestAnsForm";
import List from "@/components/Shared/List";
import ShadowSection from "@/components/Shared/ShadowSection";
import { QuesType, QuestionsTypes, UserQuizAnsType } from "@/types/types";
import CustomGrid from "@/components/Shared/CustomGrid";
import HTMLReactParser from "html-react-parser";
import InputWithLabel from "@/components/Shared/InputWithLabel";
import { Button } from "@/components/Shared/Button";
import Form from "@/components/Shared/Form";
import Checkbox from "@/components/Shared/Checkbox";
import { fetchData, FetchMethodE } from "@/utils/fetch";
import pathName from "@/constants";
import Modal from "@/components/Shared/Modal";

function TestLayout({
  allQuestions,
  quizId,
  nextId,
  prevId,
  userQuizQuestionWithAnswer,
  userData,
}: {
  allQuestions: QuestionsTypes[];
  quizId: string;
  nextId?: string | boolean;
  prevId?: string | boolean;
  userQuizQuestionWithAnswer: UserQuizAnsType;
  userData: User;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleNextQuestion = () => {
    nextId && router.push(`/quiz/${quizId}/question/${nextId}`);
  };

  const handleFinalSubmitTest = async () => {
    const {
      data: finalSubRes,
      error: finalSubError,
      isLoading: finalSubLoading,
    } = await fetchData({
      url: `${pathName.finalSubmissionApiRoute.path}`,
      method: FetchMethodE.POST,
      body: {
        quizId,
        submittedBy: userData?.id,
      },
    });
    if (!finalSubRes?.error) {
      alert("Test submitted successfully.");
      router.push("/quizzes");
    }
  };

  return (
    <CustomGrid customClasses="items-start lg:grid-cols-3 lg:gap-8">
      {allQuestions.length > 0 && (
        <>
          <CandidateQuizQuestion
            handleNextQuestion={handleNextQuestion}
            userQuizQuestionWithAnswer={userQuizQuestionWithAnswer}
            prevId={prevId}
            quizId={quizId}
            nextId={nextId}
          />
          <CandidateQuestionStatus
            handleFinalSubmitTest={() => setModalOpen(true)}
            questionListHeading="Question List"
            candidateName={userData?.first_name}
            allQuestions={allQuestions}
            quizId={quizId}
            questionId={userQuizQuestionWithAnswer?.questionId}
            nextId={nextId}
          />
        </>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Test"
        onConfirm={handleFinalSubmitTest}
        description="Are you sure you want to submit the test? Once submitted, you will not be able to reattempt it."
      />
    </CustomGrid>
  );
}

export default TestLayout;

function CandidateQuizQuestion({
  userQuizQuestionWithAnswer,
  handleNextQuestion,
  quizId,
  prevId,
  nextId,
}: {
  userQuizQuestionWithAnswer: UserQuizAnsType;
  handleNextQuestion: () => void;
  quizId: string | boolean;
  prevId?: string | boolean;
  nextId?: string | boolean;
}) {
  const question: QuesType | null = userQuizQuestionWithAnswer?.question;
  const isTimerAvailable = question?.timer !== 0;
  const [timer, setTimer] = useState<number>(
    (question?.timer
      ? question?.timer - (userQuizQuestionWithAnswer?.timeTaken || 0)
      : question?.timer) || 0
  );
  const [answer, setAnswer] = useState<string[] | string>(
    question?.type === QuestionType.OBJECTIVE
      ? userQuizQuestionWithAnswer?.ans_optionsId?.split(",") || []
      : userQuizQuestionWithAnswer.ans_subjective || ""
  );
  const [markReview, setMarkReview] = useState<boolean>(false);
  const [isDisabledCheck, setIsDisabledCheck] = useState<boolean>(
    userQuizQuestionWithAnswer.ans_optionsId ? true : false
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerAvailable) {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
      } else {
        setTimer((prevTimer) => prevTimer + 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isTimerAvailable, timer]);

  // useEffect(() => {
  //   if (isTimerAvailable && timer === 0) {
  //     handleSubmitNextClick();
  //   }
  // }, [timer]);

  const handleAnsOptInput = (str: string) => {
    if (question?.type === QuestionType.OBJECTIVE) {
      if (question?.answer_type === AnswerTypeE.MULTIPLECHOICE) {
        if (Array.isArray(answer)) {
          if (!answer.includes(str)) {
            setAnswer([...answer, str]);
          } else {
            const ansFilter = answer.filter((ans) => ans !== str);
            setAnswer([...ansFilter]);
          }
        }
      } else {
        answer.length == 0 ? setAnswer([str]) : setAnswer([]);
      }
    } else {
      setAnswer(str);
    }
  };

  const formAction = async (formData: FormData) => {
    const timeTaken = isTimerAvailable
      ? question && timer && question.timer - timer
      : timer;
    const timeOver = isTimerAvailable && timeTaken === question?.timer;
    formData.append("id", userQuizQuestionWithAnswer.id);
    timeTaken && formData.append("timeTaken", timeTaken.toString());
    formData.append("timeOver", timeOver ? "1" : "0");
    formData.append("questionId", question?.id!);
    if (Array.isArray(answer)) {
      for (let ans of answer) {
        formData.append(`ans_optionsId_${ans}`, ans);
      }
    }

    const res = await handleAnsSubmission(formData);
    if (res) {
      // !markReview &&
      handleNextQuestion();
    }
  };
  return (
    <ShadowSection
      classForSec="border-2 grid grid-cols-1 gap-4 lg:col-span-2 p-6"
      aria-labelledby="question-title"
    >
      <Form action={formAction}>
        <TimerContainer isTimerAvailable={isTimerAvailable} timer={timer} />
        {HTMLReactParser(question?.editorContent || "")}
        {question?.type === QuestionType.OBJECTIVE && Array.isArray(answer) ? (
          question?.objective_options?.map(
            (option: ObjectiveOptions, index: number) => (
              <OptionContainer
                index={index}
                option={option}
                handleAnsOptInput={handleAnsOptInput}
                answerType={question.answer_type!}
                isDisabledCheck={isDisabledCheck}
                answer={answer}
              />
            )
          )
        ) : (
          <InputWithLabel
            type="textarea"
            id="answer"
            label="Type Answer"
            className="border-2 w-3/4 mt-4 p-2 h-36"
            value={answer !== null && typeof answer === "string" ? answer : ""}
            onChange={(e) => setAnswer(e.target.value)}
            name="ans_subjective"
          />
        )}
        <ButtonForQuesAction
          prevId={prevId}
          quizId={quizId}
          nextId={nextId}
          setMarkReview={setMarkReview}
        />
      </Form>
    </ShadowSection>
  );
}

function CandidateQuestionStatus({
  candidateName,
  questionListHeading,
  handleFinalSubmitTest,
  allQuestions,
  quizId,
  questionId,
  nextId,
}: {
  candidateName: string | null;
  questionListHeading: string;
  handleFinalSubmitTest: () => void;
  allQuestions: QuestionsTypes[];
  quizId: string;
  questionId: string;
  nextId: string | boolean | undefined;
}) {
  return (
    <ShadowSection
      classForSec="border-2 shadow grid grid-cols-1 gap-4 p-6"
      aria-labelledby="candidate-info-title"
    >
      <List features={["Candidate Information", `Name: ${candidateName}`]} />
      <QuestionListWithNumber
        allQuestions={allQuestions}
        questionListHeading={questionListHeading}
        questionId={questionId}
        quizId={quizId}
      />
      {!nextId && (
        <Button className="rounded-md" onClick={handleFinalSubmitTest}>
          Submit Test
        </Button>
      )}
    </ShadowSection>
  );
}

const QuestionListWithNumber = ({
  allQuestions,
  questionListHeading,
  questionId,
  quizId,
}: {
  allQuestions: QuestionsTypes[];
  questionListHeading: string;
  questionId: string;
  quizId: string;
}) => {
  return (
    <>
      <h3 className="text-lg font-semibold">{questionListHeading}</h3>
      <div className="flex flex-wrap mt-6">
        {allQuestions?.map((ques: QuestionsTypes, index: number) => (
          <Link
            key={ques?.id}
            className={classNames(
              "text-sm px-2 py-1 rounded-md w-1/6 mb-4 mx-2 text-center",
              ques?.status === UserQuizAnswerStatus.ATTEMPTED
                ? "bg-green-300"
                : ques?.status === UserQuizAnswerStatus.SKIPPED
                ? "bg-red-600"
                : ques?.status === UserQuizAnswerStatus.REVIEW
                ? "bg-yellow-400"
                : "bg-gray-300",
              questionId == ques?.id ? "border-2 border-blue-500" : ""
            )}
            href={`/quiz/${quizId}/question/${ques?.id}`}
          >
            Q{index + 1}
          </Link>
        ))}
      </div>
    </>
  );
};

const ButtonForQuesAction = ({
  prevId,
  nextId,
  quizId,
  setMarkReview,
}: {
  prevId?: string | boolean;
  nextId?: string | boolean;
  quizId: string | boolean;
  setMarkReview: (value: boolean) => void;
}) => {
  return (
    <div className={`m-2 flex justify-end`}>
      {/* <button
        onClick={() => {
          setMarkReview(true);
        }}
        className="mr-4 px-4 py-2 bg-yellow-500 text-white rounded-md"
        type="button"
      >
        Mark for Review
      </button> */}
      {prevId && (
        <Link
          href={`/quiz/${quizId}/question/${prevId}`}
          className="mr-4 px-4 py-2 bg-gray-300 rounded-md"
        >
          Previous
        </Link>
      )}
      {nextId && (
        <Link
          href={`/quiz/${quizId}/question/${nextId}`}
          className="mr-4 px-4 py-2 bg-blue-500 rounded-md"
        >
          Next
        </Link>
      )}

      <button
        className="mr-4 px-4 py-2 bg-blue-900 text-white rounded-md"
        type="submit"
      >
        Submit and Next
      </button>
    </div>
  );
};

const OptionContainer = ({
  index,
  option,
  handleAnsOptInput,
  // alreadyAnswered,
  isDisabledCheck,
  answer,
  answerType,
}: {
  index: number;
  option: ObjectiveOptions;
  handleAnsOptInput: (id: string) => void;
  // alreadyAnswered: string | null;
  isDisabledCheck: boolean;
  answer: string[] | null;
  answerType?: AnswerTypeE;
}) => {
  return (
    <div key={option.id} className="p-4 flex items-center">
      {/* <RadioInput
        id={option.id}
        value={option.id}
        checked={answer === option.id}
        handleAnyTypeRadioChange={() => handleAnsOptInput(option.id)}
        label={HTMLReactParser(option.text) || ""}
        name="ans_optionsId"
        htmlFor={"option"}
      /> */}
      <Checkbox
        id={option.id}
        value={option.id}
        checked={answer?.includes(option.id) || false}
        onChange={() => handleAnsOptInput(option.id)}
        label={HTMLReactParser(option.text)}
        // name="ans_optionsId[]"
        type="checkbox"
        isDisabled={
          answerType === AnswerTypeE.MULTIPLECHOICE
            ? false
            : answer?.length! > 0 && !answer?.includes(option.id)
        }
      />
    </div>
  );
};

const TimerContainer = ({
  isTimerAvailable,
  timer,
}: {
  isTimerAvailable: boolean;
  timer: number;
}) => {
  return (
    <div className="flex justify-between items-center my-4">
      {isTimerAvailable && (
        <div className="">
          <h3 className="text-lg font-semibold">Time</h3>
          <p>
            {Math.floor(timer / 60)}:{timer % 60}
          </p>
        </div>
      )}
    </div>
  );
};
