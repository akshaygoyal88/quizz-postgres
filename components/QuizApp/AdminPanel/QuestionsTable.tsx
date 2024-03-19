import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { Question } from "@prisma/client";
import { useState } from "react";
import HTMLReactParser from "html-react-parser";

import Modal from "@/components/Shared/Modal";

export default function QuestionsTable({
  ques,
  onActionTaken,
}: {
  ques: Question[];
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
      setTimeout(() => {
        setDeleteSuccess("");
      }, 10000);
      onActionTaken();
    } else if (data.error) {
      setError(data.error);
    }
    setIsDeleteModalOpen(false);
  };

  const duplicateHandler = async () => {
    const queData = ques.find((q) => q.id === selectedQuestionId);
    console.log(queData);
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.questionsApiPath.path}`,
      method: FetchMethodE.POST,
      body: { ...queData },
    });
    setSelectedQuestionId("");
    onActionTaken();
  };

  console.log(ques);

  return (
    <div className="sm:px-6">
      <h1>Available Questions</h1>
      {(deleteSuccess || error) && (
        <p className="bg-red-600 px-4 py-2 text-white m-3">
          {deleteSuccess || error}
        </p>
      )}
      <div className="flow-root">
        <div className="overflow-x-auto sm:-mx-6">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Question
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    <a href="#" className="group inline-flex">
                      Set
                    </a>
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Type
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Created By
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Created on
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Last Modified on
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Timer(in secs)
                    </a>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-0">
                    <span className="sr-only">Duplicate</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-0">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {ques.map((que: Question) => (
                  <tr key={que.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {HTMLReactParser(
                        que?.editorContent.replace(/<img[^>]*>/g, "").trim()
                      )}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      Question set name??
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {que.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {que.createdBy.first_name || que.createdBy.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(que.createdAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(que.updatedAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {que.timer}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <a
                        onClick={() => {
                          setIsDuplicateModalOpen(true);
                          setSelectedQuestionId(que.id);
                        }}
                        className="text-orange-600 hover:text-orange-900 hover:cursor-pointer"
                      >
                        Duplicate
                      </a>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <a
                        href={`/admin/questions/${que.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </a>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <a
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedQuestionId(que.id);
                        }}
                        className="text-red-600 hover:text-indigo-900 hover:cursor-pointer"
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
