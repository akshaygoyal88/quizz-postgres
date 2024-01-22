// Import React and other necessary modules

import { UserQuizAnswerStatus } from "@prisma/client";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RightSectionQuesList({
  questions,
  ses,
  questionStates,
  handleQuesNoClick,
  currentQuestionId,
  currInitializedQue,
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <section aria-labelledby="candidate-info-title">
        <div className="border-2 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div>
              <h2 className="" id="candidate-info-title">
                Candidate Information
              </h2>{" "}
              <p>Name: {ses?.data?.first_name}</p>
              <p>ID: {ses?.data?.id}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold">Question List</h3>
              <div className="flex flex-wrap mt-2">
                {questionStates.map((question, index) => (
                  <div key={question.id} className="w-1/6 mb-4 mx-2">
                    <button
                      onClick={() => handleQuesNoClick(question.id)}
                      className={classNames(
                        "text-sm px-2 py-1 rounded-md w-full",
                        questionStates[index].status ===
                          UserQuizAnswerStatus.ATTEMPTED
                          ? "bg-green-300"
                          : questionStates[index].status ===
                            UserQuizAnswerStatus.SKIPPED
                          ? "bg-red-600"
                          : questionStates[index].status ===
                            UserQuizAnswerStatus.REVIEW
                          ? "bg-yellow-400"
                          : "bg-gray-300",
                        currentQuestionId == question.id
                          ? "border-2 border-blue-500"
                          : ""
                      )}
                    >
                      Q{index + 1}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
