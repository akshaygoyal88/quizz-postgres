"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { useFetch } from "@/hooks/useFetch";
import HTMLReactParser from "html-react-parser/lib/index";
import { Quiz, Subscription } from "@prisma/client";

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
    url: `${pathName.userApi.path}/${ses?.data?.id}`,
  });

  useEffect(() => {
    if (ses.status === "authenticated" && !userData?.error) {
      const alreadySubscribed = userData?.Subscription.find(
        (i: Subscription) => i.quizId === quizId
      );
      if (alreadySubscribed) setIsCandidateSubscribed(true);
    }
  }, [userData, quizDetail]);

  const handleButton = async () => {
    if (ses.status !== "authenticated") router.push(`${pathName.login.path}`);
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.subscriptionApiRoute.path}`,
      method: FetchMethodE.POST,
      body: { quizId, candidateId: ses?.data?.id },
    });
    if (data && !data.error) {
      setModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {quizDetail ? (
        <>
          <div className="container mx-auto py-6 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img
                src={`https://source.unsplash.com/random/200x200?sig=${quizId}`}
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
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QuizDetail;
