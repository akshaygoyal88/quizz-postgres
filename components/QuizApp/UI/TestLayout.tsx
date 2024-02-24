"use client";
import { getSession, useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import LeftSectionQues from "./LeftSectionQues";
import RightSectionQuesList from "./RightSectionQuesList";
import { useFetch } from "@/hooks/useFetch";
import pathName from "@/constants";
import { QuizContext } from "@/context/QuizProvider";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { QuestionType, UserQuizAnswerStatus } from "@prisma/client";
import email from "next-auth/providers/email";

export default function TestLayout({ quizId }: { quizId: string }) {
  const ses = useSession();
  const quizCtx = useContext(QuizContext);

  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [currInitializedQue, setCurrInitializedQue] = useState({});
  const [questionStates, setQuestionStates] = useState<object[]>([]);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);

  const { data: questionsRes, error: questionsError } = useFetch({
    url: `${pathName.testSetApis.path}/${quizId}`,
  });

  useEffect(() => {
    if (questionsRes && !questionsRes.error && !questionsError) {
      const quesArr: any[] = questionsRes.questions.map(
        (ques: any) => ques.question
      );

      quizCtx.handleQuestionSet({ quesArr, quizId });

      const questionStates = quesArr.map((ques) => ({
        id: ques.id,
        status: UserQuizAnswerStatus.NOT_ATTEMPTED,
      }));

      setQuestionStates(questionStates);
      const firstQuestionId = questionStates.length > 0 && questionStates[0].id;
      setCurrentQuestionId(firstQuestionId);
    }
  }, [questionsRes, questionsError]);

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
          const session = await getSession();
          const currQues = session?.id && {
            submittedBy: session.id,
            quizId,
            questionId: currentQuestionId,
            // correctAnswerId: '<otion_id>'
          };

          const { data, error } = await fetchData({
            url: `${pathName.quizAnsApi.path}`,
            method: FetchMethodE.POST,
            body: currQues,
          });

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
  }, [currentQuestionId]);

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
    answer: string;
    timeTaken: number;
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
      url: `${pathName.quizAnsApi.path}/${currInitializedQue.id}`,
      method: FetchMethodE.PUT,
      body: userQueRes,
    });

    handleNextQuestion();
  };

  const handleMarkReviewQuestion = async () => {
    const { data: saveQueRes } = await fetchData({
      url: `${pathName.quizAnsApi.path}/${currInitializedQue.id}`,
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
    // questions, setId, submittedBy
    console.log("Final Submit Test");
    const {
      data: finalSubRes,
      error: finalSubError,
      isLoading: finalSubLoading,
    } = await fetchData({
      url: `/api/quiz/finalSubmission`,
      method: FetchMethodE.POST,
      body: {
        questions: questionsRes?.questions,
        quizId,
        submittedBy: ses?.data?.id,
      },
    });
    console.log(finalSubRes);
  };

  return (
    <>
      <div className="mt-4">
        <main className="pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {quizCtx.questionSet.length > 0 && (
                <LeftSectionQues
                  questions={quizCtx.questionSet}
                  currentQuestionId={currentQuestionId}
                  handleMarkReviewQuestion={handleMarkReviewQuestion}
                  handleAnswerQuestion={handleAnswerQuestion}
                  handlePreviousQuestion={handlePreviousQuestion}
                  handleNextQuestion={handleNextQuestion}
                  currInitializedQue={currInitializedQue}
                />
              )}
              {quizCtx.questionSet.length > 0 && (
                <RightSectionQuesList
                  questions={quizCtx.questionSet}
                  ses={ses}
                  questionStates={questionStates}
                  handleQuesNoClick={handleQuesNoClick}
                  currentQuestionId={currentQuestionId}
                  setId={quizId}
                  submittedBy={ses.status === "authenticated" && ses.data.id}
                  currInitializedQue={currInitializedQue}
                  handleFinalSubmitTest={handleFinalSubmitTest}
                />
              )}
            </div>

            {/* <div className="mt-8">
              <button
                onClick={handleFinalSubmitTest}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Submit
              </button>
            </div> */}
          </div>
        </main>
      </div>
    </>
  );
}
