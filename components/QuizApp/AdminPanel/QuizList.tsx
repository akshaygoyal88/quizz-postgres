"use client";

import React from "react";
import Pagination from "../../Shared/Pagination";
import pathName from "@/constants";
import EmptyState from "../../Shared/EmptyState";
import { QuizDetail } from "@/types/types";
import { useRouter } from "next/navigation";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { useState } from "react";
import Modal from "@/components/Shared/Modal";
import { formattedDate } from "@/utils/formattedDate";
import { Table } from "@/components/Shared/Table";
import { Button } from "@/components/Shared/Button";
import Link from "next/link";
import { FaEdit, FaUsers } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { QuizCreationStatusE } from "@prisma/client";
import { IoSettingsOutline } from "react-icons/io5";

export default function QuizList({
  quizzes,
  totalPages,
  totalRows,
}: {
  quizzes: QuizDetail[];
  totalPages: number;
  totalRows: number;
}) {
  const router = useRouter();
  return (
    <>
      {quizzes?.length > 0 ? (
        <>
          <div className="p-1 flex justify-evenly">
            <Button href={`${pathName.quizAdd.path}`} color="slate">
              Add Quiz
            </Button>
          </div>
          <QuizTable quizzes={quizzes} onDelete={() => router.refresh()} />
        </>
      ) : (
        <EmptyState
          title="Set"
          description="No set found"
          buttonLink={pathName.quizAdd.path}
          buttonText="Create set"
        />
      )}
      {totalRows > 10 && (
        <Pagination totalpage={totalPages || 0} totalRows={totalRows || 0} />
      )}
    </>
  );
}

function QuizTable({
  quizzes,
  onDelete,
}: {
  quizzes: QuizDetail[];
  onDelete: () => void;
}) {
  const [deleteSuccess, setDeleteSuccess] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const deleteHandler = async () => {
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.questionSetApi.path}/${selectedQuestionId}`,
      method: FetchMethodE.PUT,
      body: { status: QuizCreationStatusE.DELETE },
    });

    console.log(`${pathName.questionSetApi.path}/${selectedQuestionId}`);

    if (data && !data.error) {
      setDeleteSuccess("Deleted successfully");
      setTimeout(() => {
        setDeleteSuccess("");
      }, 10000);
      onDelete();
    } else if (data.error) {
      setDeleteSuccess(data.error);
      setTimeout(() => {
        setDeleteSuccess("");
      }, 10000);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="sm:px-6">
      {deleteSuccess && (
        <p className="bg-red-600 px-4 py-2 text-white m-3">{deleteSuccess}</p>
      )}
      <Table
        headers={[
          "Question Set",
          "No. of Questions",
          "Created By",
          "Created on  11",
          "Last Modified on",
          "Status",
          "Action",
          "Setting",
        ]}
        rows={quizzes.map((quiz) => [
          quiz.name,
          "0",
          quiz.createdBy.first_name,
          formattedDate(quiz.createdAt),
          formattedDate(quiz.updatedAt),
          <>{quiz.status}</>,
          <span className="flex justify-between items-center gap-2">
            <Link
              title="view subscriber"
              href={`quiz/subscriber/${quiz.id}?quizName=${quiz.name}`}
              className="text-orange-500 hover:text-orange-900"
            >
              <FaUsers className="h-6 w-6" />
            </Link>
            <Link
              title="edit"
              href={`/admin/quiz/${quiz.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <FaEdit className="h-6 w-6" />
            </Link>
            <a
              title="delete"
              onClick={() => {
                setIsDeleteModalOpen(true);
                setSelectedQuestionId(quiz.id);
              }}
              className="text-red-600 hover:text-indigo-900 hover:cursor-pointer"
            >
              <MdDelete className="h-6 w-6" />
            </a>
          </span>,
          <Link
            title="Quiz Settings"
            href={`${pathName.quiz.path}/${quiz.id}/settings`}
          >
            <IoSettingsOutline className="h-6 w-6" />
          </Link>,
        ])}
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        onConfirm={deleteHandler}
        description="Are you sure you want to delete this item?"
      />
    </div>
  );
}
