import pathName from "@/constants";
import { FetchMethodE, useFetch } from "@/hooks/useFetch";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Question } from "@prisma/client";
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";

export default function QuestionsTable({
  ques,
  onDelete,
}: {
  ques: Question[];
  onDelete: () => void;
}) {
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [clickedQuestionId, setClickedQuestionId] = useState(null);

  const {
    data: editSetRes,
    error: editSetError,
    isLoading: editSetIsLoading,
    fetchData,
  } = useFetch({
    url: `${pathName.questionsApiPath.path}/${clickedQuestionId}`,
    method: FetchMethodE.PUT,
  });

  const deleteHandler = async (id) => {
    // new Promise((resove, reject) => {
    setClickedQuestionId(id);
    //   resove(clickedQuestionId);
    // }).then((id) => console.log(id, "fak"));
    // await fetchData({ isDeleted: true });
    if (clickedQuestionId) {
      // await fetchData();
      //   if (!editSetError) {
      //     setDeleteSuccess("Deleted successfully");
      //     setTimeout(() => {
      //       setDeleteSuccess(null);
      //     }, 10000);
      //     setClickedQuestionId(null);
      //     onDelete();
      //   }
    }

    // try {
    //   const deleteRes = await fetch(`${pathName.questionsApiPath.path}/${id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ isDeleted: true }),
    //   });

    // } catch (error) {
    //   console.error(error);
    // }
  };
  // console.log("render");
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1>Available Questions</h1>
      {deleteSuccess && (
        <p className="bg-red-600 px-4 py-2 text-white m-3">{deleteSuccess}</p>
      )}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                    <span className="sr-only">Edit</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-0">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {ques.map((que) => (
                  <tr key={que.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {que.question_text}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {que.questionSets[0].name}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {que.type}
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
                        href={`/admin/questions/${que.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {que.name}</span>
                      </a>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <a
                        onClick={() => deleteHandler(que.id)}
                        className="text-red-600 hover:text-indigo-900 hover:cursor-pointer"
                      >
                        Delete<span className="sr-only">, {que.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
