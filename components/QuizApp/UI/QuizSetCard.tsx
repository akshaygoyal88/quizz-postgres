// QuestionSetCard.tsx

import { QuestionSet } from "@/types"; // Assuming you have a 'types' directory for your models
import HTMLReactParser from "html-react-parser";
import Link from "next/link";

import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";

interface QuizSetCardProps {
  questionSet: QuestionSet;
}

const QuizSetCard: React.FC<QuizSetCardProps> = ({ questionSet }) => {
  const formattedDate = new Date(questionSet.createdAt).toLocaleDateString();
  return (
    <li
      key={questionSet.id}
      className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
    >
      <div className="flex flex-1 flex-col p-8">
        <img
          className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
          src={`https://source.unsplash.com/random/200x200?sig=${questionSet.id}`}
          alt=""
        />
        <h3 className="mt-6 text-sm font-medium text-gray-900">
          {questionSet.name}
        </h3>
        <dl className="mt-1 flex flex-grow flex-col justify-between mb-2">
          <dt className="sr-only">Quiz Description</dt>
          <dd className="text-sm text-gray-500">
            {HTMLReactParser(questionSet.description)}
          </dd>
          <dt className="sr-only">Created by</dt>
          <dd className="mt-3">
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {questionSet.createdBy.first_name || questionSet.createdBy.email}
            </span>
          </dd>
        </dl>
        <p className="text-xs text-gray-500">Created on {formattedDate}</p>
        <p className="text-xs text-gray-500">Number of Questions: 0</p>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <Link
              href="#"
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              View Details
            </Link>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <Link
              href={`/quiz/${questionSet.id}`}
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              Quick Start
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
};

export default QuizSetCard;
