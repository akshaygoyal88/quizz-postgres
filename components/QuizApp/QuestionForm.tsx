import React from "react";
import Textarea from "../Shared/Textarea";
import { QuestionSet, QuestionType } from "@prisma/client";

interface QuestionFormProps {
  question: string;
  options: string[];
  correctAnswerIndex: number | null;
  validationError: string;
  questionType: QuestionType;
  description: string;
  defaultQuestionSet?: QuestionSet | null;
  timer: string;
  successMessage: string;
  data: QuestionSet[] | null;
  buttonText: string;
  headingText: string;
  handleRadioChange: (event: { target: { value: string } }) => void;
  handleOptionTextChange: (index: number, option: string) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleOptionChange: (index: number) => void;
  handleSaveQuestion: () => void;
  handletQuesSetChange: (value: string) => void;
  handletQueChange: (value: string) => void;
  handletTimerChange: (value: string) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  options,
  correctAnswerIndex,
  validationError,
  questionType,
  description,
  defaultQuestionSet,
  timer,
  successMessage,
  data,
  buttonText,
  headingText,
  handleRadioChange,
  handleOptionTextChange,
  handleDescriptionChange,
  handleOptionChange,
  handleSaveQuestion,
  handletQuesSetChange,
  handletQueChange,
  handletTimerChange,
}) => {
  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <form>
        <h1 className="text-lg font-semibold mb-4">{headingText}</h1>
        {/* Select Question Set */}
        <div className="mb-4">
          <select
            className="w-full border rounded-md p-2"
            onChange={(e) => handletQuesSetChange(e.target.value)}
            defaultValue={defaultQuestionSet?.name}
          >
            <option value="">Select question set</option>
            {data &&
              data.map(
                (queSet: QuestionSet) =>
                  !queSet.isDeleted && (
                    <option key={queSet.id} value={queSet.id}>
                      {queSet.name}
                    </option>
                  )
              )}
          </select>
        </div>
        {/* Question Input */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Question:</label>
          <Textarea
            className="w-full border rounded-md p-2 mt-2"
            value={question}
            onChange={(e) => handletQueChange(e.target.value)}
            id={"ques"}
            label={""}
          />
        </div>

        {/* Question Type Radio Buttons */}
        <div className="mb-4 flex justify-evenly">
          <label className="font-semibold">Select Question Type</label>
          <div>
            <input
              type="radio"
              id="subjective"
              name="questionType"
              value="SUBJECTIVE"
              checked={questionType === "SUBJECTIVE"}
              onChange={handleRadioChange}
            />
            <label htmlFor="subjective" className="ml-2">
              Subjective
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="objective"
              name="questionType"
              value="OBJECTIVE"
              checked={questionType === "OBJECTIVE"}
              onChange={handleRadioChange}
            />
            <label htmlFor="objective" className="ml-2">
              Objective
            </label>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <label className="font-semibold">Timer(in secs):</label>
          <input
            type="number"
            className="border rounded-md p-2"
            value={timer}
            onChange={(e) => handletTimerChange(e.target.value)}
          />
        </div>

        {/* Options for Objective Questions */}
        {questionType === "OBJECTIVE" && (
          <div className="mb-4">
            <label className="block text-lg font-semibold">Options:</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={option}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) =>
                    handleOptionTextChange(index, e.target.value)
                  }
                />
                <label className="flex items-center space-x-2 p-4">
                  <input
                    type="radio"
                    checked={correctAnswerIndex === index}
                    onChange={() => handleOptionChange(index)}
                    className="form-radio text-blue-500 transform scale-125 font-bold"
                  />
                </label>
              </div>
            ))}
            {/* Validation Error Message */}
          </div>
        )}

        {/* Description for Subjective Questions */}
        {questionType === "SUBJECTIVE" && (
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full h-9 px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Write Description for Problem statement here...."
            />
          </div>
        )}
        <div className="text-red-500 mb-2">{validationError}</div>
        {successMessage && (
          <p className="bg-green-500 py-2 px-4 m-2">{successMessage}</p>
        )}

        {/* Save Question Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSaveQuestion}
            className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg"
          >
            Save Question{buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
