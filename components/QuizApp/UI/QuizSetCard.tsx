"use client";
import React, { useEffect, useState } from "react";
import HTMLReactParser from "html-react-parser";
import Link from "next/link";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import { Subscription } from "@prisma/client";
import Modal from "@/components/Shared/Modal";
import { ModalElements } from "./QuizDetail";
import { useSession } from "next-auth/react";
import { QuizDetail } from "@/types/types";

const QuizSetCard = ({
  quiz,
  submittedBy,
}: {
  quiz: QuizDetail;
  submittedBy: string;
}) => {
  const router = useRouter();
  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState<string | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const ses = useSession();
  const formattedDate = quiz.createdAt.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
  } = useFetch({
    url: `${pathName.userApi.path}/${submittedBy}?${subscribedSuccess}`,
  });

  useEffect(() => {
    if (!userData?.error) {
      const alreadySubscribed = userData?.Subscription.find(
        (i: Subscription) => i.quizId === quiz.id
      );
      if (alreadySubscribed) setIsUserSubscribed(true);
    }
  }, [userData]);

  const handleQuickStart = async () => {
    router.push(`/quiz/${quiz.id}`);
  };

  const handleSubscribeConfirm = async () => {
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.subscriptionApiRoute.path}`,
      method: FetchMethodE.POST,
      body: { quizId: quiz.id, candidateId: ses?.data?.id },
    });
    if (data && !data.error) {
      setSubscribedSuccess("Successfully taken subscription.");
    }
  };
  const handleCancelAndCountinue = () => {
    setModalOpen(false);
    if (subscribedSuccess) setSubscribedSuccess(null);
  };

  const handleSubscribe = () => {
    setModalOpen(true);
  };

  return (
    <li
      key={quiz.id}
      className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
    >
      <Link href={`${pathName.quizRoute.path}/${quiz.id}`}>
        <div className="flex flex-1 flex-col p-8">
          <img
            className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
            src={`https://source.unsplash.com/random/200x200?sig=${quiz.name}`}
            alt=""
          />
          <h3 className="mt-6 text-sm font-medium text-gray-900">
            {quiz.name}
          </h3>
          <dl className="mt-1 flex flex-grow flex-col justify-between mb-2">
            <dt className="sr-only">Quiz Description</dt>
            <dd className="text-sm text-gray-500">
              {HTMLReactParser(quiz.description)}
            </dd>
            <dt className="sr-only">Created by</dt>
            <dd className="mt-3">
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                {quiz.createdBy.first_name || quiz.createdBy.email}
              </span>
            </dd>
          </dl>
          <p className="text-s text-gray-500">Created on {formattedDate}</p>
          <p className="text-s text-gray-500">Number of Questions: 0</p>
        </div>
      </Link>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          {(ses.status !== "authenticated" || !isUserSubscribed) && (
            <div className="flex w-0 flex-1">
              <Link
                href={`${pathName.quizRoute.path}/${quiz.id}`}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                View Details
              </Link>
            </div>
          )}
          <div className="-ml-px flex w-0 flex-1">
            {isUserSubscribed ? (
              <button
                // href={`/quiz/${quiz.id}`}
                onClick={handleQuickStart}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                Quick Start
              </button>
            ) : (
              <button
                // href={`/quiz/${quiz.id}`}
                onClick={handleSubscribe}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                Subscribe Now
              </button>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Subscription of quiz"
      >
        <ModalElements
          subscribedSuccess={subscribedSuccess}
          quizDetails={quiz}
          handleSubscribeConfirm={handleSubscribeConfirm}
          handleCancelAndCountinue={handleCancelAndCountinue}
        />
      </Modal>
    </li>
  );
};

export default QuizSetCard;
