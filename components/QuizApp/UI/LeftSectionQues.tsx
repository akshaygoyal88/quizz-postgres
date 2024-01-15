import React from "react";

export default function LeftSectionQues({
  questions,
  currentQuestionIndex,
  timer,
  handleMarkReviewQuestion,
  handleAnswerQuestion,
  handlePreviousQuestion,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
      <section aria-labelledby="question-title">
        <div className="border-2 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="" id="question-title">
                Question {questions[currentQuestionIndex].id}
              </h2>
              <div className="mt-8">
                <h3 className="text-lg font-semibold">Timer</h3>
                <p>
                  {Math.floor(timer / 60)}:{timer % 60}
                </p>
              </div>
            </div>
            <p>{questions[currentQuestionIndex].content}</p>
          </div>
          <div className="m-2 flex justify-between">
            {/* <div className="flex justify-between"> */}
            <button
              onClick={handlePreviousQuestion}
              className="mr-4 px-4 py-2 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            <button
              onClick={handleMarkReviewQuestion}
              className="mr-4 px-4 py-2 bg-yellow-500 text-white rounded-md"
            >
              Mark For Review
            </button>

            <button
              onClick={handleAnswerQuestion}
              className="mr-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Next
            </button>
            {/* </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}
