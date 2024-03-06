"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { useFetch } from "@/hooks/useFetch";
import HTMLReactParser from "html-react-parser/lib/index";
import { Subscription, Quiz } from "@prisma/client";
import Modal from "@/components/Shared/Modal";
import { Session } from "next-auth";

const quiz = {
  negativeMarking: true,
  reviews: [
    { rating: 5, comment: "Great quiz!" },
    { rating: 4, comment: "Good quiz." },
  ],
};

const QuizDetail = ({ quizId }: { quizId: string }) => {
  const ses = useSession();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isCandidateSubscribed, setIsCandidateSubscribed] =
    useState<boolean>(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState<string | null>(
    null
  );
  const {
    data: quizDetail,
    error: quizDetailError,
    isLoading: QuizDetailLoading,
  } = useFetch({
    url: `${pathName.quizDetailApiRoute.path}/${quizId}`,
  });

  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
  } = useFetch({
    url: `${pathName.userApi.path}/${ses?.data?.id}?${subscribedSuccess}`,
  });

  useEffect(() => {
    if (ses.status === "authenticated" && !userData?.error && !userDataError) {
      const alreadySubscribed = userData?.Subscription.find(
        (i: Subscription) => i.quizId === quizId
      );
      if (alreadySubscribed) setIsCandidateSubscribed(true);
    }
  }, [userData, quizDetail]);

  const handleButton = async () => {
    if (ses.status !== "authenticated") router.push(`${pathName.login.path}`);
    if (isCandidateSubscribed) router.push(`/quiz/${quizId}`);
    else setModalOpen(true);
  };

  const handleSubscribeConfirm = async () => {
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.subscriptionApiRoute.path}`,
      method: FetchMethodE.POST,
      body: { quizId, candidateId: ses?.data?.id },
    });
    if (data && !data.error) {
      setSubscribedSuccess("Successfully taken subscription.");
    }
  };
  const handleCancelAndCountinue = () => {
    setModalOpen(false);
    if (subscribedSuccess) setSubscribedSuccess(null);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {quizDetail ? (
        <>
          <div className="container mx-auto py-6 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img
                src={`https://source.unsplash.com/random/?city,night200x200?sig=${quizId}`}
                alt="Quiz Image"
                className="w-full h-auto mb-4 md:mb-0 md:max-w-sm md:self-start"
              />
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="text-3xl font-bold mb-4">{quiz.quizName}</h1>
                  <p className="text-lg mb-2">
                    <span className="font-semibold">Owner:</span>{" "}
                    <span>
                      {quizDetail?.createdBy?.first_name ||
                        quizDetail?.createdBy?.email}
                    </span>
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold">Description:</span>{" "}
                    <span>{HTMLReactParser(quizDetail?.description)}</span>
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold">Number of Questions:</span>{" "}
                    <span>{"<need to figure out logic>"}</span>
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold">Published Date:</span>{" "}
                    <span>{quizDetail?.createdAt}</span>
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold">Total Marks:</span>{" "}
                    <span>{"<need to figure out logic>"}</span>
                  </p>

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
                    ses={ses}
                    isCandidateSubscribed={isCandidateSubscribed}
                    handleButton={handleButton}
                  />
                </div>
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
                quizDetail={quizDetail}
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
};

export default QuizDetail;

export const ModalElements = ({
  subscribedSuccess,
  quizDetail,
  handleSubscribeConfirm,
  handleCancelAndCountinue,
}: {
  subscribedSuccess: string | null;
  quizDetail: Quiz;
  handleSubscribeConfirm: () => void;
  handleCancelAndCountinue: () => void;
}) => {
  return (
    <>
      <h1>{quizDetail.name}</h1>
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
  ses,
  isCandidateSubscribed,
  handleButton,
}: {
  ses: Session;
  isCandidateSubscribed: boolean;
  handleButton: () => void;
}) => {
  return (
    <button
      className={` 
    ${
      ses?.status === "authenticated"
        ? isCandidateSubscribed
          ? "bg-blue-500"
          : "bg-orange-700"
        : "bg-purple-600"
    }  
    text-white px-4 py-2 rounded-md mt-4 font-semibold hover:cursor-pointer`}
      onClick={handleButton}
    >
      {ses?.status === "authenticated"
        ? isCandidateSubscribed
          ? "Start Quiz"
          : "Subscribe to Quiz"
        : "Please sign in to subscribe"}
    </button>
  );
};
