"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import HTMLReactParser from "html-react-parser/lib/index";
import { Subscription, Quiz, User } from "@prisma/client";
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
}: {
  quizId: string;
  firstQuesId?: string;
  quizDetails: QuizDetailType;
  userData: User | null;
  isCandidateSubscribed: Subscription | undefined;
}) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState<string | null>(
    null
  );

  const handleButton = async () => {
    if (userData === null) router.push(`${pathName.login.path}`);
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

  const handleSubscribeConfirm = async () => {
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.subscriptionApiRoute.path}`,
      method: FetchMethodE.POST,
      body: { quizId, candidateId: userData?.id },
    });
    if (data && !data.error) {
      setSubscribedSuccess("Successfully taken subscription.");
    }
  };
  const handleCancelAndCountinue = () => {
    setModalOpen(false);
    if (subscribedSuccess) setSubscribedSuccess(null);
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
            {!isCandidateSubscribed && (
              <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Subscription of quiz"
              >
                <ModalElements
                  subscribedSuccess={subscribedSuccess}
                  quizDetails={quizDetails}
                  handleSubscribeConfirm={handleSubscribeConfirm}
                  handleCancelAndCountinue={handleCancelAndCountinue}
                />
              </Modal>
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

export const ModalElements = ({
  subscribedSuccess,
  quizDetails,
  handleSubscribeConfirm,
  handleCancelAndCountinue,
}: {
  subscribedSuccess: string | null;
  quizDetails: Quiz;
  handleSubscribeConfirm: () => void;
  handleCancelAndCountinue: () => void;
}) => {
  return (
    <>
      <h1>{quizDetails.name}</h1>
      {subscribedSuccess && (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-green-500 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only text-gray-600">{subscribedSuccess}</span>
          </div>
          <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {subscribedSuccess}
          </p>
        </div>
      )}
      <div className="flex justify-end space-x-4">
        {!subscribedSuccess && (
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 focus:outline-none"
            onClick={handleSubscribeConfirm}
          >
            Confirm
          </button>
        )}
        <button
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300 focus:outline-none"
          onClick={handleCancelAndCountinue}
        >
          {subscribedSuccess ? "Continue" : "Cancel"}
        </button>
      </div>
    </>
  );
};

const ButtonForDetail = ({
  authStatus,
  isCandidateSubscribed,
  handleButton,
}: {
  authStatus: boolean;
  isCandidateSubscribed: Subscription | undefined;
  handleButton: () => void;
}) => {
  return (
    <button
      className={` 
    ${
      authStatus
        ? isCandidateSubscribed
          ? "bg-blue-500"
          : "bg-orange-700"
        : "bg-purple-600"
    }  
    text-white px-4 py-2 rounded-bottom-md mt-4 font-semibold hover:cursor-pointer w-full`}
      onClick={handleButton}
    >
      {authStatus
        ? isCandidateSubscribed
          ? "Start Quiz"
          : "Subscribe to Quiz"
        : "Please sign in to subscribe"}
    </button>
  );
};
