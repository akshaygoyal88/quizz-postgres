import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { Quiz } from "@prisma/client";
import { useState } from "react";
import DeleteModal from "../Shared/DeleteModal";

export default function QuizTable({
  queSets,
  onDelete,
}: {
  queSets: Quiz;
  onDelete: () => void;
}) {
  const [deleteSuccess, setDeleteSuccess] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const deleteHandler = async () => {
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.questionSetApi.path}/${selectedQuestionId}`,
      method: FetchMethodE.PUT,
      body: { isDeleted: true },
    });

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
    <div className="">
      <div className="">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
            {deleteSuccess && (
              <p className="bg-red-600 px-4 py-2 text-white m-3">
                {deleteSuccess}
              </p>
            )}
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Question Set
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    <a href="#" className="group inline-flex">
                      No. of Questions
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
                  <th scope="col" className="relative py-3.5 pl-3 pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-0">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {queSets.map((set: Quiz) => (
                  <tr key={set.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {set.name}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      0
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {set.createdBy.first_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(set.createdAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(set.updatedAt).toLocaleString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <a
                        href={`/admin/quiz/${set.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {set.name}</span>
                      </a>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <a
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedQuestionId(set.id);
                        }}
                        className="text-red-600 hover:text-indigo-900 hover:cursor-pointer"
                      >
                        Delete<span className="sr-only">, {set.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteHandler}
      />
    </div>
  );
}
