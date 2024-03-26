"use client";

import React from "react";
import Pagination from "../../Shared/Pagination";
import EmptyState from "../../Shared/EmptyState";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { useState } from "react";
import HTMLReactParser from "html-react-parser";
import Modal from "@/components/Shared/Modal";
import { QuestionsTypes } from "@/types/types";
import { Table } from "@/components/Shared/Table";
import { formattedDate } from "@/utils/formattedDate";
import Heading from "@/components/Shared/Heading";

export default function QuestionsList({
  quesData,
  totalPages,
  totalRows,
}: {
  quesData: QuestionsTypes[];
  totalPages: number;
  totalRows: number;
}) {
  const router = useRouter();

  return (
    <>
      {quesData && quesData.length > 0 && (
        <div className="p-1 flex justify-evenly">
          <Button href={`${pathName.questionsAdd.path}`} color="slate">
            Add question
          </Button>
        </div>
      )}
      {quesData && quesData?.length > 0 ? (
        <QuestionsTable
          ques={quesData}
          onActionTaken={() => router.refresh()}
        />
      ) : (
        <EmptyState
          title="Questions"
          description="No question available"
          buttonLink={pathName.questionsAdd.path}
          buttonText="Add Questions"
        />
      )}
      {quesData && quesData.length > 0 && (
        <Pagination totalpage={totalPages || 0} totalRows={totalRows || 0} />
      )}
    </>
  );
}

function QuestionsTable({
  ques,
  onActionTaken,
}: {
  ques: QuestionsTypes[];
  onActionTaken: () => void;
}) {
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  const deleteHandler = async () => {
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.questionsApiPath.path}/${selectedQuestionId}`,
      method: FetchMethodE.PUT,
      body: { isDeleted: true },
    });

    if (data && !data.error) {
      setDeleteSuccess("Deleted successfully");
      onActionTaken();
    } else if (data.error) {
      setError(data.error);
    }
    setIsDeleteModalOpen(false);
  };

  const duplicateHandler = async () => {
    const queData = ques.find(
      (q: QuestionsTypes) => q?.id === selectedQuestionId
    );
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.questionsApiPath.path}`,
      method: FetchMethodE.POST,
      body: { ...queData },
    });
    setSelectedQuestionId("");
    onActionTaken();
  };
  const tableRows = ques.map((que) => [
    <>
      {HTMLReactParser(
        que?.editorContent?.replace(/<img[^>]*>/g, "").trim() || ""
      )}
    </>,
    <>Question set name??</>,
    <>{que?.type}</>,
    <>{que?.createdBy?.first_name || que?.createdBy?.email}</>,
    <>{formattedDate(que?.createdAt!)}</>,
    <>{formattedDate(que?.updatedAt!)}</>,
    <>{que?.timer}</>,
    <>
      <a
        onClick={() => {
          setIsDuplicateModalOpen(true);
          setSelectedQuestionId(que?.id!);
        }}
        className="text-orange-600 hover:text-orange-900 hover:cursor-pointer"
      >
        Duplicate
      </a>
    </>,
    <>
      <a
        href={`/admin/questions/${que?.id!}/edit`}
        className="text-indigo-600 hover:text-indigo-900"
      >
        Edit
      </a>
    </>,
    <>
      <a
        onClick={() => {
          setIsDeleteModalOpen(true);
          setSelectedQuestionId(que?.id!);
        }}
        className="text-red-600 hover:text-indigo-900 hover:cursor-pointer"
      >
        Delete
      </a>
    </>,
  ]);

  return (
    <div className="sm:px-6">
      <Heading headingText="All Questions" tag={"h1"} />
      {(deleteSuccess || error) && (
        <p className="bg-red-600 px-4 py-2 text-white m-3">
          {deleteSuccess || error}
        </p>
      )}
      <Table
        headers={[
          "Question",
          "Set",
          "Type",
          "Created By",
          "Created on",
          "Last Modified on",
          "Timer(in secs)",
        ]}
        rows={tableRows}
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        onConfirm={deleteHandler}
        description="Are you sure you want to delete this item?"
      />
      <Modal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        title="Confirm Duplication"
        onConfirm={duplicateHandler}
        description="Are you sure you want to duplicate this item?"
      />
    </div>
  );
}
