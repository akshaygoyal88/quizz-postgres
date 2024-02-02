import React, { useState } from "react";
import Textarea from "../Shared/Textarea";
import { QuestionSet, QuestionType } from "@prisma/client";
import { handleQuestionSubmit } from "@/action/actionsQuesForm";
import { QuestionSubmitE } from "@/services/questions";
import { useSession } from "next-auth/react";
import TinyMCEEditor from "./UI/TinyMCEEditor";

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
  action: QuestionSubmitE;
  quesId: string;
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
  // successMessage,
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
  action,
  quesId,
}) => {
  const session = useSession();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const formAction = async (formData: FormData) => {
    setError(null);
    formData.append("editorContent", editorContent as string);
    const res = await handleQuestionSubmit(formData, action);
    console.log(res);

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccessMessage(
        action === QuestionSubmitE.ADD
          ? "Successfully added Question."
          : "Successfully updated Question."
      );
    }
  };

  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (content: string, editor: any) => {
    setEditorContent(content);
    console.log("Content was updated:", content, "editor:", editor);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <form action={formAction}>
        <h1 className="text-lg font-semibold mb-4">{headingText}</h1>
        {/* Select Question Set */}
        <input type="hidden" name="createdById" value={session?.data?.id} />
        {action == QuestionSubmitE.EDIT && (
          <input type="hidden" name="id" value={quesId} />
        )}

        <div className="mb-4">
          <select
            className="w-full border rounded-md p-2"
            // onChange={(e) => handletQuesSetChange(e.target.value)}
            defaultValue={defaultQuestionSet?.name}
            name="setId"
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
          <label className="block text-lg font-semibold" htmlFor="ques">
            Question:
          </label>
          <Textarea
            className="w-full border rounded-md p-2 mt-2"
            defaultValue={question}
            // onChange={(e) => handletQueChange(e.target.value)}
            id="ques"
            name="question" // Add name attribute here
            label={""}
          />
        </div>
        <TinyMCEEditor
          initialValue={editorContent}
          handleEditorChange={handleEditorChange}
        />

        {/* Question Type Radio Buttons */}
        <div className="mb-4 flex justify-evenly">
          <label className="font-semibold">Select Question Type</label>
          <div>
            <input
              type="radio"
              id="subjective"
              name="questionType"
              defaultValue={QuestionType.SUBJECTIVE}
              checked={questionType === QuestionType.SUBJECTIVE}
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
              defaultValue={QuestionType.OBJECTIVE}
              checked={questionType === QuestionType.OBJECTIVE}
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
            defaultValue={timer}
            // onChange={(e) => handletTimerChange(e.target.value)}
            name="timer" // Add name attribute here
          />
        </div>

        {/* Options for Objective Questions */}
        {questionType === QuestionType.OBJECTIVE && (
          <div className="mb-4">
            <label className="block text-lg font-semibold">Options:</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  defaultValue={option}
                  placeholder={`Option ${index + 1}`}
                  // onChange={(e) =>
                  //   handleOptionTextChange(index, e.target.value)
                  // }
                  name={`questionOptions_${index}`} // Add name attribute here
                />
                <label className="flex items-center space-x-2 p-4">
                  <input
                    type="radio"
                    checked={correctAnswerIndex === index}
                    onChange={() => handleOptionChange(index)}
                    className="form-radio text-blue-500 transform scale-125 font-bold"
                    // name="correctAnswer" // Add name attribute here
                  />
                  {correctAnswerIndex !== null && (
                    <input
                      type="hidden"
                      name="correctAnswer"
                      value={correctAnswerIndex.toString()}
                    />
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
        {/* Description for Subjective Questions */}
        {questionType === QuestionType.SUBJECTIVE && (
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
              name="description" // Add name attribute here
              defaultValue={description}
              // onChange={handleDescriptionChange}
              placeholder="Write Description for Problem statement here...."
            />
          </div>
        )}

        <div className="text-red-500 mb-2">{error}</div>
        {successMessage && (
          <p className="bg-green-500 py-2 px-4 m-2">{successMessage}</p>
        )}

        {/* Save Question Button */}
        <div className="flex justify-center">
          <button
            // onClick={handleSaveQuestion}
            className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg"
          >
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
