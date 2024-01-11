import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";

export default function QuizTable({ queSets, getSetsAndQuestions, onDelete }) {
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const deleteHandler = async (id) => {
    try {
      const deleteRes = await fetch(`/api/questionset/${id}`, {
        method: "DELETE",
      });

      if (deleteRes.ok) {
        setDeleteSuccess("Deleted successfully");
        setTimeout(() => {
          setDeleteSuccess(null);
        }, 10000);
        // getSetsAndQuestions();
        onDelete();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                      Description
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
                {queSets.map(
                  (set: {
                    id: Key | null | undefined;
                    name:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | PromiseLikeOfReactNode
                      | null
                      | undefined;
                    questions: string | any[];
                    description:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | PromiseLikeOfReactNode
                      | null
                      | undefined;
                    createdAt: string | number | Date;
                    updatedAt: string | number | Date;
                  }) => (
                    <tr key={set.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {set.name}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {set.questions.length}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {set.description}
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
                          onClick={() => deleteHandler(set.id)}
                          className="text-red-600 hover:text-indigo-900 hover:cursor-pointer"
                        >
                          Delete<span className="sr-only">, {set.name}</span>
                        </a>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
