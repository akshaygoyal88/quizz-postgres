import React from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RightSectionQuesList({
  questions,
  ses,
  questionStates,
  handleQuesNoClick,
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
              <ul className="flex space-x-4 mt-2">
                {questions.map((question, index) => (
                  <li key={question.id}>
                    <button
                      className={classNames(
                        "text-sm px-2 py-1 rounded-md",
                        questionStates[index] === "attempted"
                          ? "bg-green-300"
                          : questionStates[index] === "skipped"
                          ? "bg-red-600"
                          : questionStates[index] === "review"
                          ? "bg-yellow-400"
                          : "bg-gray-300"
                      )}
                      onClick={() => handleQuesNoClick(index)}
                    >
                      Q{question.id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
