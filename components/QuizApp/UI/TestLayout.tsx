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

// enum questionActionE {
//   NOT_ATTEMPTED = "not_attempted",
//   ATTEMPTED = "attempted",
//   REVIEW = "review",
//   SKIPPED = "skipped",
// }

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

  const {
    data: questionsRes,
    error: questionsError,
    isLoading: questionsIsLoading,
  } = useFetch({
    url: `${pathName.testSetApis.path}/${quizId}`,
  });

  useEffect(() => {
    if (questionsRes && !questionsRes.error && !questionsError) {
      const quesArr: [] = questionsRes.questions.map(
        (ques: { id: any; question: any }) => ques.question
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
      for (let i = 0; i < questionStates.length; i++) {
        if (questionStates[i].id === currentQuestionId) {
          i < questionStates.length - 1 && setNextId(questionStates[i + 1].id);
          i > 0 && setPrevId(questionStates[i - 1].id);
        }
      }

      const initializeQue = async () => {
        const session = await getSession();
        const currQues = session?.id && {
          submittedBy: session.id,
          setId: quizId,
          questionId: currentQuestionId,
        };
        const { data, error, isLoading } = await fetchData({
          url: `${pathName.quizAnsApi.path}`,
          method: FetchMethodE.POST,
          body: currQues,
        });
        if (data && !data.error) {
          setQuestionStates((prevStates) => {
            const updatedStates = prevStates.map((que) => {
              if (que.id === currentQuestionId) {
                return {
                  ...que,
                  status: data.ques.status,
                };
              }
              return que;
            });
            return updatedStates;
          });
          setCurrInitializedQue(data.ques);
        }
      };
      initializeQue();
    }
  }, [currentQuestionId]);

  useEffect(() => {}, []);
  const handleNextQuestion = () => {
    nextId && setCurrentQuestionId(nextId);
  };
  const handlePreviousQuestion = () => {
    prevId && setCurrentQuestionId(prevId);
  };

  const handleAnswerQuestion = async ({
    answer,
    type,
  }: {
    answer: string;
    type: QuestionType;
  }) => {
    console.log(answer);
    let userQueRes = { type };
    if (answer) {
      if (type === QuestionType.OBJECTIVE) {
        console.log("sssssssssssssssssssssssssssss");
        userQueRes = { ...userQueRes, ans_optionsId: answer };
      } else if (type === QuestionType.SUBJECTIVE) {
        userQueRes = { ...userQueRes, ans_subjective: answer };
      }
    }
    const {
      data: saveQueRes,
      error: saveQueResError,
      isLoading: saveQuesLoading,
    } = await fetchData({
      url: `${pathName.quizAnsApi.path}/${currInitializedQue.id}`,
      method: FetchMethodE.PUT,
      body: userQueRes,
    });
    handleNextQuestion();
    // }
  };
  const handleMarkReviewQuestion = () => {
    // setQuestionStates((prevStates) => {
    //   const updatedStates = [...prevStates];
    //   updatedStates[currentQuestionIndex] = questionActionE.REVIEW;
    //   return updatedStates;
    // });
    // handleNextQuestion();
  };

  const handleQuesNoClick = (id: string) => {
    setCurrentQuestionId(id);
  };

  const handleSubmit = () => {};

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
                />
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
