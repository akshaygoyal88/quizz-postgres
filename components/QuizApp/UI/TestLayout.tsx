"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import {
  ObjectiveOptions,
  Question,
  QuestionType,
  QuizQuestions,
  User,
  UserQuizAnswerStatus,
  UserQuizAnswers,
} from "@prisma/client";
import HTMLReactParser from "html-react-parser";
import Textarea from "@/components/Shared/Textarea";
import { classNames } from "@/utils/classNames";

export interface QuestionState {
  id: string;
  status: UserQuizAnswerStatus;
}

function TestLayout({
  allQuizQuestions,
  quizId,
  allQuestions,
}: {
  allQuizQuestions: QuizQuestions[];
  quizId: string;
  allQuestions: Question[];
}) {
  const ses = useSession();
  const userData: User = ses?.data;
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [currInitializedQue, setCurrInitializedQue] =
    useState<UserQuizAnswers | null>(null);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);

  useEffect(() => {
    if (allQuestions?.length > 0) {
      const questionStates = allQuestions?.map((ques) => ({
        id: ques.id,
        status: UserQuizAnswerStatus.NOT_ATTEMPTED,
      }));

      if (questionStates && questionStates.length > 0) {
        setQuestionStates(questionStates);
        const firstQuestionId = questionStates[0].id;
        setCurrentQuestionId(firstQuestionId);
      }
    }
  }, []);

  useEffect(() => {
    if (currentQuestionId) {
      const currentIndex = questionStates.findIndex(
        (que) => que.id === currentQuestionId
      );

      if (currentIndex !== -1) {
        currentIndex < questionStates.length - 1 &&
          setNextId(questionStates[currentIndex + 1].id);
        currentIndex > 0 && setPrevId(questionStates[currentIndex - 1].id);

        const initializeQue = async () => {
          const currQues = {
            submittedBy: userData?.id,
            quizId,
            questionId: currentQuestionId,
            // correctAnswerId: '<otion_id>'
          };

          const { data, error } = await fetchData({
            url: `${pathName.quizAnsApi.path}`,
            method: FetchMethodE.POST,
            body: currQues,
          }); //question initialization or if it's initialized then set the preStatus....

          if (data && !data.error) {
            setQuestionStates((prevStates) => {
              const updatedStates = prevStates.map((que) =>
                que.id === currentQuestionId
                  ? { ...que, status: data.ques.status }
                  : que
              );
              return updatedStates;
            });
            setCurrInitializedQue(data.ques);
          }
        };
        initializeQue();
      }
    }
  }, [currentQuestionId, ses]);

  const handleNextQuestion = () => {
    nextId && setCurrentQuestionId(nextId);
  };

  const handlePreviousQuestion = () => {
    prevId && setCurrentQuestionId(prevId);
  };

  const handleAnswerQuestion = async ({
    answer,
    timeTaken,
    type,
    timeOver,
  }: {
    answer: string | null;
    timeTaken: number | undefined;
    type: QuestionType;
    timeOver: boolean;
  }) => {
    let userQueRes: { type: QuestionType; [key: string]: any } = { type };
    if (answer) {
      if (type === QuestionType.OBJECTIVE) {
        userQueRes = {
          ...userQueRes,
          ans_optionsId: answer,
          timeTaken,
          timeOver,
        };
      } else if (type === QuestionType.SUBJECTIVE) {
        userQueRes = {
          ...userQueRes,
          ans_subjective: answer,
          timeTaken,
          timeOver,
        };
      }
    }
    setQuestionStates((prevStates) => {
      const updatedStates = prevStates.map((que) =>
        que.id === currentQuestionId
          ? {
              ...que,
              status: answer
                ? UserQuizAnswerStatus.ATTEMPTED
                : UserQuizAnswerStatus.SKIPPED,
            }
          : que
      );
      return updatedStates;
    });

    const { data: saveQueRes } = await fetchData({
      url: `${pathName.quizAnsApi.path}/${currInitializedQue?.id}`,
      method: FetchMethodE.PUT,
      body: userQueRes,
    });

    handleNextQuestion();
  };

  const handleMarkReviewQuestion = async () => {
    const { data: saveQueRes } = await fetchData({
      url: `${pathName.quizAnsApi.path}/${currInitializedQue?.id}`,
      method: FetchMethodE.PUT,
      body: { status: UserQuizAnswerStatus.REVIEW },
    });
    setQuestionStates((prevStates) => {
      const updatedStates = prevStates.map((que) =>
        que.id === currentQuestionId
          ? {
              ...que,
              status: UserQuizAnswerStatus.REVIEW,
            }
          : que
      );
      return updatedStates;
    });
    handleNextQuestion();
  };

  const handleQuesNoClick = (id: string) => {
    setCurrentQuestionId(id);
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
        questions: allQuizQuestions,
        quizId,
        submittedBy: userData?.id,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
      {allQuestions.length > 0 && (
        <CandidateQuizQuestion
          currentQuestionId={currentQuestionId}
          handleMarkReviewQuestion={handleMarkReviewQuestion}
          handleAnswerQuestion={handleAnswerQuestion}
          handlePreviousQuestion={handlePreviousQuestion}
          currInitializedQue={currInitializedQue}
          allQuestions={allQuestions}
        />
      )}
      {allQuestions.length > 0 && (
        <CandidateQuestionStatus
          questionStates={questionStates}
          handleQuesNoClick={handleQuesNoClick}
          currentQuestionId={currentQuestionId}
          handleFinalSubmitTest={handleFinalSubmitTest}
          questionListHeading="Question List"
          candidateName={userData?.first_name}
          finalSubmitButtonLabel="Submit Test"
        />
      )}
    </div>
  );
}

export default TestLayout;

function CandidateQuizQuestion({
  currentQuestionId,
  handleMarkReviewQuestion,
  handleAnswerQuestion,
  handlePreviousQuestion,
  currInitializedQue,
  allQuestions,
}: {
  currentQuestionId: string | null;
  handleMarkReviewQuestion: () => void;
  handleAnswerQuestion: ({
    answer,
    timeTaken,
    timeOver,
    type,
  }: {
    answer: string | null;
    timeTaken: number | undefined;
    type: QuestionType;
    timeOver: boolean;
  }) => void;
  handlePreviousQuestion: () => void;
  currInitializedQue: UserQuizAnswers | null;
  allQuestions: Question[];
}) {
  const filtredQues: Question | undefined = allQuestions?.find(
    (q) => q.id === currentQuestionId
  );
  const isTimerAvailable = filtredQues?.timer !== 0;
  const [timer, setTimer] = useState<number>(filtredQues?.timer || 0);
  const [answer, setAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (currInitializedQue) {
      setAnswer(
        filtredQues?.type === QuestionType.OBJECTIVE
          ? currInitializedQue.ans_optionsId
          : currInitializedQue.ans_subjective
      );
    }
  }, [currInitializedQue]);

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

  useEffect(() => {
    if (isTimerAvailable && timer === 0) {
      handleSubmitNextClick();
    }
  }, [timer]);

  useEffect(() => {
    setAnswer(null);
    filtredQues && setTimer(filtredQues.timer);
  }, [currentQuestionId]);

  const handleSubmitNextClick = () => {
    const timeTaken = isTimerAvailable
      ? filtredQues && timer && filtredQues.timer - timer
      : timer;
    const timeOver = isTimerAvailable && timeTaken === filtredQues?.timer;
    console.log(timeOver, timeTaken);
    filtredQues &&
      handleAnswerQuestion({
        answer,
        timeTaken,
        timeOver,
        type: filtredQues.type,
      });
    answer && setAnswer(null);
  };

  const handlePrevious = () => {
    handlePreviousQuestion();
  };

  const handleAnsOptInput = (str: string) => {
    setAnswer(str);
  };
  const optionsIndex = ["a", "b", "c", "d", "e", "f"];

  return (
    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
      <section aria-labelledby="question-title">
        <div className="border-2 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="" id="question-title">
                Question {filtredQues && allQuestions.indexOf(filtredQues) + 1}
              </h2>
              {isTimerAvailable && (
                <div className="">
                  <h3 className="text-lg font-semibold">Time</h3>

                  <p>
                    {Math.floor(timer / 60)}:{timer % 60}
                  </p>
                </div>
              )}
            </div>
            <p className="py-4">{filtredQues?.question_text}</p>
            <div>
              {filtredQues &&
                filtredQues.editorContent &&
                HTMLReactParser(filtredQues.editorContent)}
            </div>

            {filtredQues?.type === QuestionType.OBJECTIVE ? (
              <div className="mt-4">
                {filtredQues.objective_options.map(
                  (option: ObjectiveOptions, index: number) => (
                    <div key={index} className="p-4 flex items-center">
                      <input
                        type="radio"
                        name="options"
                        value={option.text}
                        onChange={() => handleAnsOptInput(option.id)}
                        checked={answer === option.id}
                      />
                      <text className="p-2">{`(${optionsIndex[index]})`}</text>
                      <span className="ml-2">
                        {HTMLReactParser(option.text)}
                      </span>
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
                />
              </div>
            )}
          </div>
          <div className="m-2 flex justify-between">
            <button
              onClick={handlePrevious}
              className="mr-4 px-4 py-2 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            <button
              onClick={handleMarkReviewQuestion}
              className="mr-4 px-4 py-2 bg-yellow-500 text-white rounded-md"
            >
              Mark For Review
            </button>
            <button
              onClick={handleSubmitNextClick}
              className="mr-4 px-4 py-2 bg-blue-900 text-white rounded-md"
            >
              Submit and Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CandidateQuestionStatus({
  candidateName,
  questionListHeading,
  finalSubmitButtonLabel,
  questionStates,
  handleQuesNoClick,
  currentQuestionId,
  handleFinalSubmitTest,
}: {
  candidateName: string | null;
  questionListHeading: string;
  finalSubmitButtonLabel: string;
  questionStates: QuestionState[];
  handleQuesNoClick: (quesId: string) => void;
  currentQuestionId: string | null;
  handleFinalSubmitTest: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <section aria-labelledby="candidate-info-title">
        <div className="border-2 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div>
              <h2 className="" id="candidate-info-title">
                Candidate Information
              </h2>
              <p>Name: {candidateName}</p>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold">{questionListHeading}</h3>
              <div className="flex flex-wrap mt-2">
                {questionStates.map((question, index) => (
                  <div key={question.id} className="w-1/6 mb-4 mx-2">
                    <button
                      onClick={() => handleQuesNoClick(question.id)}
                      className={classNames(
                        "text-sm px-2 py-1 rounded-md w-full",
                        questionStates[index].status ===
                          UserQuizAnswerStatus.ATTEMPTED
                          ? "bg-green-300"
                          : questionStates[index].status ===
                            UserQuizAnswerStatus.SKIPPED
                          ? "bg-red-600"
                          : questionStates[index].status ===
                            UserQuizAnswerStatus.REVIEW
                          ? "bg-yellow-400"
                          : "bg-gray-300",
                        currentQuestionId == question.id
                          ? "border-2 border-blue-500"
                          : ""
                      )}
                    >
                      Q{index + 1}
                    </button>
                  </div>
                ))}
              </div>
              {currentQuestionId ===
                questionStates[questionStates.length - 1]?.id && (
                <button
                  className="mx-2 bg-blue-500 px-4 py-2 rounded-sm text-white"
                  onClick={handleFinalSubmitTest}
                >
                  {finalSubmitButtonLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
