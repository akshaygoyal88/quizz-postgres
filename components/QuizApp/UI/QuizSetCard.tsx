"use client";
import React, { useEffect, useState } from "react";
import HTMLReactParser from "html-react-parser";
import Link from "next/link";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { QuizDetail, UserDataType } from "@/types/types";
import Modal from "@/components/Shared/Modal";
import { Subscription } from "@prisma/client";
import { formattedDate } from "@/utils/formattedDate";
import { Button } from "@/components/Shared/Button";

interface QuizSetCardProps {
  quiz: QuizDetail;
  userData: UserDataType | null;
}
interface QuizInformationProps {
  quiz: QuizDetail;
  formattedDate: string;
}

const QuizSetCard: React.FC<QuizSetCardProps> = ({ quiz, userData }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const isUserSubscribed =
    userData &&
    userData.Subscription.find((i: Subscription) => i.quizId === quiz.id)
      ? true
      : false;
  const handleSubscribeConfirm = async () => {
    if (userData) {
      const { data, error, isLoading } = await fetchData({
        url: `${pathName.subscriptionApiRoute.path}`,
        method: FetchMethodE.POST,
        body: { quizId: quiz.id, candidateId: userData?.id },
      });
      if (data && !data.error) {
        router.refresh();
      }
    } else {
      router.push(pathName.login.path);
    }
  };

  return (
    <li
      key={quiz.id}
      className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-lg"
    >
      <Link href={`${pathName.quizRoute.path}/${quiz.id}`}>
        <QuizInformation
          quiz={quiz}
          formattedDate={formattedDate(quiz.createdAt)}
        />
      </Link>
      {isUserSubscribed ? (
        <Button
          variant="quizCard"
          onClick={() => router.push(`/quiz/${quiz.id}`)}
        >
          Quick Start
        </Button>
      ) : (
        <Button
          variant="quizCard"
          onClick={() => {
            userData ? setModalOpen(true) : router.push(pathName.login.path);
          }}
        >
          Subscribe Now
        </Button>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Subscription of quiz"
        onConfirm={handleSubscribeConfirm}
        description="Are you sure you want to subscribe to this quiz?"
      />
    </li>
  );
};

export default QuizSetCard;

const QuizInformation: React.FC<QuizInformationProps> = ({
  quiz,
  formattedDate,
}) => {
  return (
    <div className="flex flex-1 flex-col p-8">
      <img
        className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
        src={`https://source.unsplash.com/random/200x200?sig=${quiz.name}`}
        alt=""
      />
      <h3 className="mt-6 text-sm font-medium text-gray-900">{quiz.name}</h3>
      <dl className="mt-1 flex flex-grow flex-col justify-between mb-2">
        <dt className="sr-only">Quiz Description</dt>
        <dd className="text-sm text-gray-500">
          {HTMLReactParser(quiz.description || "")}
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
  );
};
