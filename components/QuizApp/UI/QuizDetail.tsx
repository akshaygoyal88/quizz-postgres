"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";

const quiz = {
  ownerName: "John Doe",
  quizName: "Example Quiz",
  description: "This is an example quiz.",
  numQuestions: 10,
  publishedDate: "2022-04-01",
  totalMarks: 100,
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

  const handleButton = async () => {
    if (ses.status !== "authenticated") router.push(`${pathName.login.path}`);
    console.log(ses.data.id);
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
      {quiz ? (
        <>
          <div className="container mx-auto py-6 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img
                src="https://via.placeholder.com/400x200"
                alt="Quiz Image"
                className="w-full h-auto mb-4 md:mb-0 md:max-w-sm md:self-start"
              />
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="text-3xl font-bold mb-4">{quiz.quizName}</h1>
                  <p className="text-lg font-semibold mb-2">
                    Owner: {quiz.ownerName}
                  </p>
                  <p className="text-lg font-semibold mb-2">
                    Description: {quiz.description}
                  </p>
                  <p className="text-lg font-semibold mb-2">
                    Number of Questions: {quiz.numQuestions}
                  </p>
                  <p className="text-lg font-semibold mb-2">
                    Published Date: {quiz.publishedDate}
                  </p>
                  <p className="text-lg font-semibold mb-2">
                    Total Marks: {quiz.totalMarks}
                  </p>
                  <p className="text-lg font-semibold mb-2">
                    Negative Marking: {quiz.negativeMarking ? "Yes" : "No"}
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
                    className={`${
                      ses?.status === "authenticated"
                        ? "bg-orange-700"
                        : "bg-purple-600"
                    } text-white px-4 py-2 rounded-md mt-4 font-semibold hover:cursor-pointer`}
                    onClick={handleButton}
                  >
                    {ses?.status === "authenticated"
                      ? "Subscribe to Quiz"
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
