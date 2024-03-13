"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import HTMLReactParser from "html-react-parser/lib/index";
import { Subscription, Quiz, User } from "@prisma/client";
import Modal from "@/components/Shared/Modal";
import { QuizDetailType, UserDataType } from "@/types/types";

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
    return (
      <div className="container mx-auto py-6 px-4">
        {quizDetails ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img
                src={`https://source.unsplash.com/random/?city,night200x200?sig=${quizId}`}
                alt="Quiz Image"
                className="w-full h-auto mb-4 md:mb-0 md:max-w-sm md:self-start"
              />
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="text-3xl font-bold mb-4">
                    {quizDetails?.name}
                  </h1>
                  <div className="text-lg mb-2">
                    <span className="font-semibold">Owner:</span>{" "}
                    <span>
                      {quizDetails?.createdBy?.first_name ||
                        quizDetails?.createdBy?.email}
                    </span>
                  </div>
                  <div className="text-lg mb-2">
                    <span className="font-semibold">Description:</span>{" "}
                    <span>
                      {quizDetails.description &&
                        HTMLReactParser(quizDetails.description)}
                    </span>
                  </div>
                  <div className="text-lg mb-2">
                    <span className="font-semibold">Number of Questions:</span>{" "}
                    <span>{"<need to figure out logic>"}</span>
                  </div>
                  <div className="text-lg mb-2">
                    <span className="font-semibold">Published Date:</span>{" "}
                    <span>
                      {quizDetails.createdAt.toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>

                  <div className="text-lg mb-2">
                    <span className="font-semibold">Total Marks:</span>{" "}
                    <span>{"<need to figure out logic>"}</span>
                  </div>

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
                  <ButtonForDetail
                    authStatus={userData !== null}
                    isCandidateSubscribed={isCandidateSubscribed}
                    handleButton={handleButton}
                  />
                </div>
              </div>
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
      </div>
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
    text-white px-4 py-2 rounded-md mt-4 font-semibold hover:cursor-pointer`}
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
