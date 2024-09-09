"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import HTMLReactParser from "html-react-parser/lib/index";
import { Subscription, User } from "@prisma/client";
import Modal from "@/components/Shared/Modal";
import { QuizDetailType } from "@/types/types";
import List from "@/components/Shared/List";
import ShadowSection from "@/components/Shared/ShadowSection";
import CustomGrid from "@/components/Shared/CustomGrid";
import CustomImage from "@/components/Shared/CustomImage";

const quiz = {
  negativeMarking: true,
  reviews: [
    { rating: 5, comment: "Great quiz!" },
    { rating: 4, comment: "Good quiz." },
  ],
};

const QuizDetail = ({
  quizId,
  firstQuesId,
  quizDetails,
  userData,
  isCandidateSubscribed,
  isDone,
}: {
  quizId: string;
  firstQuesId?: string;
  quizDetails: any;
  userData: User | null;
  isCandidateSubscribed: any;
  isDone?: boolean;
}) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState<string | null>(
    null
  );

  const [done, setDone] = useState(false);
  useEffect(() => {});

  console.log(userData, "userData");

  const handleButton = async () => {
    if (userData === null) router.push(`${pathName.login.path}`);
    else if (isDone) setModalOpen(true);
    else if (isCandidateSubscribed) {
      const {
        data: initializeQuizRes,
        error: initializeQueryError,
        isLoading: initializeQueLoading,
      } = await fetchData({
        url: `${pathName.testSetApis.path}`,
        method: FetchMethodE.POST,
        body: {
          quizId: quizId,
          submittedBy: userData?.id,
        },
      });

      if (initializeQuizRes.isAvailable || initializeQuizRes.isInitialized) {
        router.push(
          `${pathName.quizRoute.path}/${quizId}/${pathName.questionRoute.path}/${firstQuesId}`
        );
      }
    } else setModalOpen(true);
  };
  console.log(quizId, "quizId");
  const handleSubscribeConfirm = async () => {
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.subscriptionApiRoute.path}`,
      method: FetchMethodE.POST,
      body: { quizId, candidateId: userData?.id },
    });
    if (data && !data.error) {
      setSubscribedSuccess("Successfully taken subscription.");
      router.refresh();
    }
  };
  if ("error" in quizDetails) {
    return <>{quizDetails.error}</>;
  } else {
    const publishedDate = `Published Date: ${quizDetails.createdAt.toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    )}`;

    const des = HTMLReactParser(quizDetails.description || "");

    return (
      <>
        {quizDetails ? (
          <>
            <CustomGrid columns={2}>
              <CustomImage
                src={`https://source.unsplash.com/random/?city,night200x200?sig=${quizId}`}
                alt="Quiz Image"
                className="object-cover w-full h-48 md:h-auto"
                style={{ borderRadius: "1%" }}
              />
              <ShadowSection classForSec="flex flex-col justify-between">
                <List
                  heading={quizDetails?.name}
                  description={des}
                  classesForlist="px-6 sm:px-8"
                  features={[
                    `Owner: ${
                      quizDetails?.createdBy?.first_name ||
                      quizDetails?.createdBy?.email
                    }`,
                    `${publishedDate}`,
                    "Number of Questions: <need to figure out logic>",
                    "Total Marks: <need to figure out logic>",
                  ]}
                />

                <ButtonForDetail
                  authStatus={userData !== null}
                  isCandidateSubscribed={isCandidateSubscribed}
                  handleButton={handleButton}
                  isDone={isDone}
                />
              </ShadowSection>
            </CustomGrid>
            <h2 className="text-xl font-bold mb-2">Reviews</h2>
            <div className="space-y-2">
              {quiz.reviews.map((review, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-lg font-semibold mr-2">
                    {review.rating}/5
                  </span>
                  <p className="text-lg">{review.comment}</p>
                </div>
              ))}
            </div>
            {isDone ? (
              <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Do You Want To See Your Report"
                onConfirm={() =>
                  router.push(`/cm0nf2zgu00008fpn8u916lo7/reports/${quizId}`)
                }
                description="Click Confirm To See "
              />
            ) : (
              !isCandidateSubscribed && (
                <Modal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="Subscription of quiz"
                  onConfirm={handleSubscribeConfirm}
                  description="Are you sure you want to subscribe to this quiz?"
                />
              )
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </>
    );
  }
};

export default QuizDetail;

const ButtonForDetail = ({
  authStatus,
  isCandidateSubscribed,
  handleButton,
  isDone,
}: {
  authStatus: boolean;
  isCandidateSubscribed: Subscription | undefined;
  handleButton: () => void;
  isDone?: boolean;
}) => {
  console.log();
  return (
    <button
      className={` 
    ${
      isDone
        ? "bg-emerald-500"
        : authStatus
        ? isCandidateSubscribed
          ? "bg-blue-500"
          : "bg-orange-700"
        : "bg-purple-600"
    }  
    text-white px-4 py-2 rounded-bottom-md mt-4 font-semibold hover:cursor-pointer w-full`}
      // onClick={() => {
      //   if (!isDone) {
      //     handleButton();
      //   }
      // }}

      onClick={handleButton}
    >
      {isDone
        ? "You've already completed this quiz. If you want to check your results Please Click on they button "
        : authStatus
        ? isCandidateSubscribed
          ? "Start Quiz"
          : "Subscribe to Quiz"
        : "Please sign in to subscribe"}
    </button>
  );
};
