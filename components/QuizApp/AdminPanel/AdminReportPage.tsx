"use client";

import React from "react";
import Pagination from "../../Shared/Pagination";
import Lable from "../../Shared/Lable";
import { Quiz } from "@prisma/client";
import pathName from "@/constants";
import { QuizDetail, UserQuizReportTypes } from "@/types/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { IoEllipsisVertical } from "react-icons/io5";
import { classNames } from "@/utils/classNames";
import { formattedDate } from "@/utils/formattedDate";
import { Table } from "@/components/Shared/Table";

export default function AdminReportPage({
  quizData,
  quizId,
  quizReportData,
  totalPages,
  totalRows,
}: {
  quizData: QuizDetail[];
  quizId: string | undefined;
  quizReportData: UserQuizReportTypes[];
  totalPages: number;
  totalRows: number;
}) {
  const router = useRouter();

  const handleSelectQuiz = (id: string) => {
    router.push(`${pathName.adminReportsRoute.path}/${id || undefined}`);
  };

  return (
    <div className="sm:px-6">
      <SelectQuiz
        defaultValue={quizId}
        quizzes={quizData}
        handleSelectQuiz={handleSelectQuiz}
      />
      {quizId === "undefined" ? (
        <div className="flex flex-col items-center">
          Please select quiz to see report.
        </div>
      ) : (
        <>
          <QuizReportList quizResByUser={quizReportData} />
          {quizReportData.length > 8 && (
            <Pagination
              totalpage={totalPages || 0}
              totalRows={totalRows || 0}
            />
          )}
        </>
      )}
    </div>
  );
}

function SelectQuiz({
  defaultValue,
  quizzes,
  handleSelectQuiz,
}: {
  defaultValue?: string;
  quizzes: Quiz[];
  handleSelectQuiz: (id: string) => void;
}) {
  return (
    <div className="m-4 flex items-center gap-4">
      <Lable labelText="Please select quiz for report:" />
      <select
        className=" border rounded-md p-2"
        defaultValue={defaultValue}
        name="setId"
        onChange={(e) => handleSelectQuiz(e.target.value)}
      >
        <option value={quizzes[0].name}>{quizzes[0].name}</option>
        {quizzes &&
          quizzes.map((q: Quiz) =>
            !q.isDeleted ? (
              <option key={q.id} value={q.id}>
                {q.name}
              </option>
            ) : null
          )}
      </select>
    </div>
  );
}

const statuses = {
  GENERATED: "text-green-700 bg-green-50 ring-green-600/20",
  INITIALIZE: "text-gray-600 bg-gray-50 ring-gray-500/10",
  UNDERREVIEW: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
};

const QuizReportList = ({
  quizResByUser,
}: {
  quizResByUser: UserQuizReportTypes[];
}) => {
  const tableRows = quizResByUser.map((report) => [
    <>{report?.user?.first_name || report.user?.email?.split("@")[0]}</>,
    <>{report.candidateStatus}</>,
    <>{formattedDate(report.candidateQuizStartTime)}</>,
    <>{formattedDate(report.candidateQuizEndtime!)}</>,
    <>{report.obtMarks}</>,
    <>{report.totalMarks}</>,
    <p
      className={classNames(
        statuses[report.quizOwnerStatus],
        "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
      )}
    >
      {report.quizOwnerStatus}
    </p>,
    <Link
      title="View Report Summary"
      href={`${pathName.adminReportsRoute.path}/${report.quizId}/${report.id}?submittedBy=${report.candidateId}`}
      className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
    >
      View
    </Link>,
  ]);
  return (
    // <ul role="list" className="divide-y divide-gray-100">
    //   {quizResByUser.map((quiz) => (
    //     <li
    //       key={quiz.id}
    //       className="flex items-center justify-between gap-x-6 py-5"
    //     >
    //       <div className="flex gap-5 items-center">
    //         <img
    //           src={quiz.user.profile_pic!}
    //           className="rounded-3xl w-10 h-10"
    //         />
    //         <div className="min-w-0">
    //           <div className="flex items-start gap-x-3">
    //             <p className="text-sm font-semibold leading-6 text-gray-900">
    //               {quiz?.user?.first_name || quiz.user?.email}
    //             </p>
    //             <p
    //               className={classNames(
    //                 statuses[quiz?.reportStatus],
    //                 "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
    //               )}
    //             >
    //               {quiz.reportStatus}
    //             </p>
    //           </div>
    //           <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
    //             <p className="whitespace-nowrap">
    //               Started At{" "}
    //               <time dateTime={`${quiz.startedAt}`}>
    //                 {formattedDate(quiz.startedAt)}
    //               </time>
    //             </p>
    //             <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
    //               <circle cx={1} cy={1} r={1} />
    //             </svg>
    //             <p className="whitespace-nowrap">
    //               End At{" "}
    //               <time dateTime={`${quiz.startedAt}`}>
    //                 {quiz.endedAt ? formattedDate(quiz.endedAt) : "N/A"}
    //               </time>
    //             </p>
    //             <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
    //               <circle cx={1} cy={1} r={1} />
    //             </svg>
    //             <p className="truncate">
    //               Candidate Test status{" "}
    //               <text className="font-semibold">{quiz.status}</text>
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="flex flex-none items-center gap-x-4">
    //         <Link
    //           href={`${pathName.adminReportsRoute.path}/${quiz.quizId}/${quiz.id}?quizId=${quiz.quizId}&submittedBy=${quiz.submittedBy}&reportStatus=${quiz.reportStatus}`}
    //           className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
    //         >
    //           View <span className="sr-only">, {quiz.name}</span>
    //         </Link>
    //         <Menu as="div" className="relative flex-none">
    //           <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
    //             <span className="sr-only">Open options</span>
    //             <IoEllipsisVertical className="h-5 w-5" aria-hidden="true" />
    //           </Menu.Button>
    //           <Transition
    //             as={Fragment}
    //             enter="transition ease-out duration-100"
    //             enterFrom="transform opacity-0 scale-95"
    //             enterTo="transform opacity-100 scale-100"
    //             leave="transition ease-in duration-75"
    //             leaveFrom="transform opacity-100 scale-100"
    //             leaveTo="transform opacity-0 scale-95"
    //           >
    //             <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
    //               <Menu.Item>
    //                 {({ active }) => (
    //                   <a
    //                     href="#"
    //                     className={classNames(
    //                       active ? "bg-gray-50" : "",
    //                       "block px-3 py-1 text-sm leading-6 text-gray-900"
    //                     )}
    //                   >
    //                     Edit<span className="sr-only">, {quiz.name}</span>
    //                   </a>
    //                 )}
    //               </Menu.Item>
    //               <Menu.Item>
    //                 {({ active }) => (
    //                   <a
    //                     href="#"
    //                     className={classNames(
    //                       active ? "bg-gray-50" : "",
    //                       "block px-3 py-1 text-sm leading-6 text-gray-900"
    //                     )}
    //                   >
    //                     Move<span className="sr-only">, {quiz.name}</span>
    //                   </a>
    //                 )}
    //               </Menu.Item>
    //               <Menu.Item>
    //                 {({ active }) => (
    //                   <a
    //                     href="#"
    //                     className={classNames(
    //                       active ? "bg-gray-50" : "",
    //                       "block px-3 py-1 text-sm leading-6 text-gray-900"
    //                     )}
    //                   >
    //                     Delete<span className="sr-only">, {quiz.name}</span>
    //                   </a>
    //                 )}
    //               </Menu.Item>
    //             </Menu.Items>
    //           </Transition>
    //         </Menu>
    //       </div>
    //     </li>
    //   ))}
    // </ul>
    <Table
      headers={[
        "Candidate",
        "Test Status",
        "Started At",
        "Submitted At",
        "Obtained marks",
        "Total Marks",
        "Report status",
        "Action",
      ]}
      rows={tableRows}
    />
  );
};
