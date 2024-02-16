import React, { useEffect, useState } from "react";
import Textarea from "../Shared/Textarea";
import { AnswerTypeE, QuestionSet, QuestionType } from "@prisma/client";
import { handleQuestionSubmit } from "@/action/actionsQuesForm";
import { QuestionSubmitE } from "@/services/questions";
import { useSession } from "next-auth/react";
import TinyMCEEditor from "./UI/TinyMCEEditor";
import { useFetch } from "@/hooks/useFetch";
import SimpleSelect from "../Shared/SimpleSelect";
import SimpleToggle from "../Shared/SimpleToggle";

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
  handleCorrectOptionChange: (index: number) => void;
  handleSaveQuestion: () => void;
  handletQuesSetChange: (value: string) => void;
  handletQueChange: (value: string) => void;
  handletTimerChange: (value: string) => void;
  action: QuestionSubmitE;
  quesId?: string;
  editorsContent?: string;
  handleOptionIncrease: () => void;
  handleOptionRemove: () => void;
  handleAnyTypeRadioChange: (event: { target: { value: string } }) => void;
  objAnsType: AnswerTypeE;
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
  handleCorrectOptionChange,
  action,
  quesId,
  editorsContent,
  handleOptionIncrease,
  handleOptionTextChange,
  handleOptionRemove,
  handleAnyTypeRadioChange,
  objAnsType
}) => {
  const session = useSession();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string | null>(null);
  const [savedOptions, setSavedOptions] = useState<string[]>([]);
  const [desEditorContent, setDesEditorContent] = useState<string | null>(null);

  const [imagesList, setImagesList] = useState([]);
  // const { data: imageList, error: imagesError, isLoading } = useFetch({url: })
  console.log(validationError);

  useEffect(() => {
    fetchImagesFromS3();
  }, []);

  const fetchImagesFromS3 = async () => {
    try {
      const response = await fetch("/api/fetchImages");
      if (!response.ok) {
        throw new Error("Failed to fetch images from S3");
      }
      const imageList = await response.json();

      setImagesList(imageList);
    } catch (error) {
      console.error("Error fetching images from S3:", error);
    }
  };

  const formAction = async (formData: FormData) => {
    setError(null);
    formData.append("editorContent", editorContent as string);
    // console.log(correctAnswerIndex);
    correctAnswerIndex?.forEach((ele: Number) =>
      formData.append(`correctAnswer_${ele}`, ele as string)
    );
    if (desEditorContent) {
      formData.append("solution", desEditorContent as string);
    }
    options.forEach((option, i) =>
      formData.append(`questionOptions_${i}`, option)
    );

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
  console.log(correctAnswerIndex);

  useEffect(() => {
    if (options.length > 0) {
      setSavedOptions([...options]);
    }
  }, [options.length]);
  useEffect(() => {
    if (buttonText == "Save") {
      handleOptionIncrease();
    }
  }, []);
  const handleEditorChange = (content: string, editor: any) => {
    setEditorContent(content);
    console.log("Content was updated:", content, "editor:", editor);
  };
  const handleDesChange = (content: string, editor: any) => {
    setDesEditorContent(content);
  };
  return (
    <div className="border rounded-lg shadow-lg">
      <form action={formAction} className="m-4">
        {/* <div className="m-4 w-3/4"> */}
        <div className="flex flex-wrap justify-between items-center lg:flex-row">
          <h1 className="text-lg font-semibold">{headingText}</h1>
          <button className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg">
            {buttonText}
          </button>
        </div>
        {successMessage && (
          <p className="bg-green-500 py-2 px-4 m-2">{successMessage}</p>
        )}
        <div className="text-red-500 mb-2">{error}</div>
        <input type="hidden" name="createdById" value={session?.data?.id} />
        {action == QuestionSubmitE.EDIT && (
          <input type="hidden" name="id" value={quesId} />
        )}

        <div className="mb-4 bg-gray-100 p-3 rounded-md">
          <label className="block text-lg font-semibold" htmlFor="ques">
            Question:
          </label>
          <TinyMCEEditor
            editorsContent={editorsContent}
            handleEditorChange={handleEditorChange}
            imagesList={imagesList}
            idx={"ques"}
          />
          {/* SETTINGS */}
          <div className="">
            <div className="flex items-center space-x-2">
              <label className="font-semibold">Question Type:</label>
              <div>
                <select
                  className="w-48 m-2 block rounded-md border-0 py-1.5 pl-0.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={questionType}
                  name="questionType"
                  onChange={handleRadioChange}
                >
                  <option value={QuestionType.OBJECTIVE}>Objective</option>
                  <option value={QuestionType.SUBJECTIVE}>Subjective</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-semibold py-2">Timer (in secs):</label>
              <input
                type="number"
                className="w-48 m-2 block rounded-md border-0 py-1.5 pl-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={timer}
                name="timer"
              />
            </div>
            <SimpleSelect
              selectFor="Visibility"
              items={["Public", "private", "Password"]}
            />
            <SelectSet defaultValue={defaultQuestionSet?.name} data={data} />
          </div>
          {questionType === QuestionType.OBJECTIVE && (
            <div className="my-4 flex gap-4">
              <label className="font-semibold">
                Is this question has multiple correct answers?
              </label>
              <div>
                <input
                  type="radio"
                  id="SingleCorrect"
                  name="answer_type"
                  value={AnswerTypeE.SINGLECHOICE}
                  // defaultValue={QuestionType.SUBJECTIVE}
                  checked={objAnsType === AnswerTypeE.SINGLECHOICE}
                  onChange={handleAnyTypeRadioChange}
                />
                <label htmlFor="SingleCorrect" className="ml-2">
                  No
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="multipleChoice"
                  name="answer_type"
                  value={AnswerTypeE.MULTIPLECHOICE}
                  // defaultValue={QuestionType.OBJECTIVE}
                  checked={objAnsType === AnswerTypeE.MULTIPLECHOICE}
                  onChange={handleAnyTypeRadioChange}
                />
                <label htmlFor="multipleChoice" className="ml-2">
                  Yes
                </label>
              </div>
            </div>
          )}
        </div>

        {questionType === QuestionType.OBJECTIVE && (
          <div className="mb-4">
            <div className="my-3 text-right">
              <div className="text-red-500 mb-2">{validationError}</div>
              <span
                className="rounded px-2 py-1 bg-yellow-600 text-white font-semibold hover:cursor-pointer"
                onClick={handleOptionIncrease}
              >
                Add more options+
              </span>
            </div>

            {options.map((option, index) => (
              <div
                key={index}
                className="flex flex-col mb-3 p-3 bg-blue-50 rounded-md"
              >
                <div className="flex justify-between">
                  <span className="py-2">Option:{index + 1}</span>
                  <span className="flex items-center gap-5 py-2">
                    <label>Is correct</label>
                    <SimpleToggle
                      checked={correctAnswerIndex?.includes(index)}
                      onChange={() => handleCorrectOptionChange(index)}
                    />
                  </span>
                  <span
                    className="cursor-pointer text-red-600"
                    onClick={() => handleOptionRemove(index)}
                  >
                    Remove
                  </span>
                </div>
                <div className="">
                  <TinyMCEEditor
                    imagesList={imagesList}
                    editorsContent={savedOptions[index]}
                    index={index}
                    idx={index + buttonText}
                    handleEditorChange={handleOptionTextChange}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 p-3 bg-cyan-100 rounded-md">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="description"
          >
            Solution:
          </label>
          <TinyMCEEditor
            editorsContent={description}
            handleEditorChange={handleDesChange}
            imagesList={imagesList}
            idx={"sol"}
          />
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;

function SelectSet({
  defaultValue,
  data
}: {
  defaultValue: string;
  data: QuestionSet[];
}) {
  return (
    <div className="mb-4">
      <select
        className="w-full border rounded-md p-2"
        defaultValue={defaultValue}
        name="setId"
      >
        <option value="">Select question set</option>
        {data &&
          data.map((queSet: QuestionSet) =>
            !queSet.isDeleted ? (
              <option key={queSet.id} value={queSet.id}>
                {queSet.name}
              </option>
            ) : null
          )}
      </select>
    </div>
  );
}
