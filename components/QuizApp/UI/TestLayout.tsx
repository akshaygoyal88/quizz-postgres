"use client";
import { useState, useEffect } from "react";
import {
  AnswerTypeE,
  ObjectiveOptions,
  QuestionType,
  User,
  UserQuizAnswerStatus,
} from "@prisma/client";
import HTMLReactParser from "html-react-parser";
import Textarea from "@/components/Shared/Textarea";
import { classNames } from "@/utils/classNames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleAnsSubmission } from "@/action/actionTestAnsForm";
import List from "@/components/Shared/List";
import ShadowSection from "@/components/Shared/ShadowSection";
import { QuesType, UserQuizAnsType } from "@/types/types";
import CustomGrid from "@/components/Shared/CustomGrid";
import { Button } from "@/components/Button";

type QuestionsTypes =
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
      status: UserQuizAnswerStatus;
    })
  | null;

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

  const handleNextQuestion = () => {
    nextId && router.push(`/quiz/${quizId}/question/${nextId}`);
  };

  const handleFinalSubmitTest = async () => {
    // const {
    //   data: finalSubRes,
    //   error: finalSubError,
    //   isLoading: finalSubLoading,
    // } = await fetchData({
    //   url: `${pathName.finalSubmissionApiRoute.path}`,
    //   method: FetchMethodE.POST,
    //   body: {
    //     questions: allQuizQuestions,
    //     quizId,
    //     submittedBy: userData?.id,
    //   },
    // });
  };

  return (
    <CustomGrid customClasses="items-start lg:grid-cols-3 lg:gap-8">
      {allQuestions.length > 0 && (
        <CandidateQuizQuestion
          handleNextQuestion={handleNextQuestion}
          userQuizQuestionWithAnswer={userQuizQuestionWithAnswer}
          prevId={prevId}
          quizId={quizId}
        />
      )}
      {allQuestions.length > 0 && (
        <CandidateQuestionStatus
          handleFinalSubmitTest={handleFinalSubmitTest}
          questionListHeading="Question List"
          candidateName={userData?.first_name}
          finalSubmitButtonLabel="Submit Test"
          allQuestions={allQuestions}
          quizId={quizId}
          questionId={userQuizQuestionWithAnswer?.questionId}
          nextId={nextId}
        />
      )}
    </CustomGrid>
  );
}

export default TestLayout;

function CandidateQuizQuestion({
  userQuizQuestionWithAnswer,
  handleNextQuestion,
  quizId,
  prevId,
}: {
  userQuizQuestionWithAnswer: UserQuizAnsType;
  handleNextQuestion: () => void;
  quizId: string | boolean;
  prevId?: string | boolean;
}) {
  const question: QuesType = userQuizQuestionWithAnswer?.question;
  const isTimerAvailable = question?.timer !== 0;
  const [timer, setTimer] = useState<number>(
    (question?.timer
      ? question?.timer - (userQuizQuestionWithAnswer?.timeTaken || 0)
      : question?.timer) || 0
  );
  const [answer, setAnswer] = useState<string | null>(
    userQuizQuestionWithAnswer.ans_optionsId ||
      userQuizQuestionWithAnswer.ans_subjective ||
      null
  );
  const [markReview, setMarkReview] = useState<boolean>(false);

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
    setAnswer(str);
  };
  const optionsIndex = ["a", "b", "c", "d", "e", "f"];

  const formAction = async (formData: FormData) => {
    const timeTaken = isTimerAvailable
      ? question && timer && question.timer - timer
      : timer;
    const timeOver = isTimerAvailable && timeTaken === question?.timer;
    formData.append("id", userQuizQuestionWithAnswer.id);
    formData.append("timeTaken", timeTaken.toString());
    formData.append("timeOver", timeOver ? "1" : "0");
    formData.append(
      "status",
      !markReview
        ? answer
          ? UserQuizAnswerStatus.ATTEMPTED
          : UserQuizAnswerStatus.SKIPPED
        : UserQuizAnswerStatus.REVIEW
    );
    const res = await handleAnsSubmission(formData);
    if (res) {
      // !markReview &&
      handleNextQuestion();
    }
  };

  return (
    <ShadowSection
      classForSec="border-2 grid grid-cols-1 gap-4 lg:col-span-2"
      aria-labelledby="question-title"
    >
      <form action={formAction} className="p-6">
        <div className="flex justify-between items-center">
          {isTimerAvailable && (
            <div className="">
              <h3 className="text-lg font-semibold">Time</h3>
              <p>
                {Math.floor(timer / 60)}:{timer % 60}
              </p>
            </div>
          )}
        </div>
        <div>{question && HTMLReactParser(question?.editorContent || "")}</div>
        {question?.type === QuestionType.OBJECTIVE ? (
          <div className="mt-4">
            {question?.objective_options?.map(
              (option: ObjectiveOptions, index: number) => (
                <div key={index} className="p-4 flex items-center">
                  <input
                    type="radio"
                    name="ans_optionsId"
                    value={option.id}
                    onChange={() => handleAnsOptInput(option.id)}
                    checked={answer === option.id}
                  />
                  <span className="p-2">{`(${optionsIndex[index]})`}</span>
                  <span className="ml-2">{HTMLReactParser(option.text)}</span>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="mt-4">
            <Textarea
              id="answer"
              label="Type Answer"
              className="border-2 w-3/4"
              value={answer === null ? "" : answer}
              onChange={(e) => setAnswer(e.target.value)}
              name="ans_subjective"
            />
          </div>
        )}

        <ButtonForQuesAction
          prevId={prevId}
          quizId={quizId}
          setMarkReview={setMarkReview}
        />
      </form>
    </ShadowSection>
  );
}

function CandidateQuestionStatus({
  candidateName,
  questionListHeading,
  finalSubmitButtonLabel,
  handleFinalSubmitTest,
  allQuestions,
  quizId,
  questionId,
  nextId,
}: {
  candidateName: string | null;
  questionListHeading: string;
  finalSubmitButtonLabel: string;
  handleFinalSubmitTest: () => void;
  allQuestions: QuestionsTypes[];
  quizId: string;
  questionId: string;
  nextId: string | boolean | undefined;
}) {
  return (
    <ShadowSection
      classForSec="border-2 shadow grid grid-cols-1 gap-4"
      aria-labelledby="candidate-info-title"
    >
      <div className="p-6">
        <List features={["Candidate Information", `Name: ${candidateName}`]} />
        <div className="mt-8">
          <QuestionListWithNumber
            allQuestions={allQuestions}
            questionListHeading={questionListHeading}
            questionId={questionId}
            quizId={quizId}
          />
          {!nextId && (
            <Button className="rounded-md" onClick={handleFinalSubmitTest}>
              {finalSubmitButtonLabel}
            </Button>
          )}
        </div>
      </div>
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
      <div className="flex flex-wrap mt-2">
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
  quizId,
  setMarkReview,
}: {
  prevId?: string | boolean;
  quizId: string | boolean;
  setMarkReview: (value: boolean) => void;
}) => {
  return (
    <div className="m-2 flex justify-between">
      <button
        onClick={() => {
          setMarkReview(true);
        }}
        className="mr-4 px-4 py-2 bg-yellow-500 text-white rounded-md"
        type="button"
      >
        Mark for Review
      </button>
      {prevId && (
        <Link
          href={`/quiz/${quizId}/question/${prevId}`}
          className="mr-4 px-4 py-2 bg-gray-300 rounded-md"
        >
          Previous
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
