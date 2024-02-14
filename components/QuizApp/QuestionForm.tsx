import React, { useEffect, useState } from "react";
import Textarea from "../Shared/Textarea";
import { QuestionSet, QuestionType } from "@prisma/client";
import { handleQuestionSubmit } from "@/action/actionsQuesForm";
import { QuestionSubmitE } from "@/services/questions";
import { useSession } from "next-auth/react";
import TinyMCEEditor from "./UI/TinyMCEEditor";
import { useFetch } from "@/hooks/useFetch";
import SimpleSelect from "../Shared/SimpleSelect";

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
  quesId?: string;
  editorsContent?: string;
  handleOptionIncrease: () => void;
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
  handleOptionChange,
  action,
  quesId,
  editorsContent,
  handleOptionIncrease,
  handleOptionTextChange,
}) => {
  const session = useSession();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string | null>(null);
  const [savedOptions, setSavedOptions] = useState<string[]>([]);
  const [desEditorContent, setDesEditorContent] = useState<string | null>(null);

  const [imagesList, setImagesList] = useState([]);
  // const { data: imageList, error: imagesError, isLoading } = useFetch({url: })

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
    if (desEditorContent) {
      formData.append("subjective_description", desEditorContent as string);
    }
    // const serializedOptions = JSON.stringify(options);
    // formData.append("options", serializedOptions);
    // formData.append("options", options as Array);
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
    <div className="border rounded-lg shadow-lg w-full">
      <form action={formAction} className="flex justify-end">
        <div className="m-4 w-3/4">
          <h1 className="text-lg font-semibold mb-4">{headingText}</h1>
          <input type="hidden" name="createdById" value={session?.data?.id} />
          {action == QuestionSubmitE.EDIT && (
            <input type="hidden" name="id" value={quesId} />
          )}
          <div className="mb-4">
            <select
              className="w-full border rounded-md p-2"
              defaultValue={defaultQuestionSet?.name}
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
          <div className="mb-4">
            <label className="block text-lg font-semibold" htmlFor="ques">
              Question:
            </label>
            <TinyMCEEditor
              editorsContent={editorsContent}
              handleEditorChange={handleEditorChange}
              imagesList={imagesList}
              idx={"ques"}
            />
          </div>
          <div className="my-4 flex justify-between">
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
              name="timer"
            />
          </div>
          {questionType === QuestionType.OBJECTIVE && (
            <div className="mb-4">
              <label className="block text-lg font-semibold">Options:</label>
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center space-x-2 mt-2"
                >
                  <TinyMCEEditor
                    imagesList={imagesList}
                    editorsContent={
                      buttonText.includes("Edit") && savedOptions[index]
                    }
                    index={index}
                    idx={index + buttonText}
                    handleEditorChange={handleOptionTextChange}
                  />
                  <label className="flex items-center space-x-2 p-4">
                    <input
                      type="radio"
                      checked={correctAnswerIndex === index}
                      onChange={() => handleOptionChange(index)}
                      className="form-radio text-blue-500 transform scale-125 font-bold"
                    />
                    {correctAnswerIndex !== null && (
                      <input
                        type="hidden"
                        name="correctAnswer"
                        value={correctAnswerIndex.toString()}
                      />
                    )}
                  </label>
                  {options.length - 1 === index && (
                    <span
                      className="px-1 border-4 text-gray-600 font-semibold hover:cursor-pointer"
                      onClick={handleOptionIncrease}
                    >
                      +
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {questionType === QuestionType.SUBJECTIVE && (
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              {/* <textarea
                className="w-full h-9 px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                defaultValue={description}
                placeholder="Write Description for Problem statement here...."
              /> */}

              <TinyMCEEditor
                editorsContent={description}
                handleEditorChange={handleDesChange}
                imagesList={imagesList}
                idx={"des"}
              />
            </div>
          )}
          <div className="text-red-500 mb-2">{error}</div>
          {successMessage && (
            <p className="bg-green-500 py-2 px-4 m-2">{successMessage}</p>
          )}
        </div>
        <div className="border-l-2 flex flex-col mx-2 p-2 w-1/5">
          <button className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg">
            {buttonText}
          </button>
          <SimpleSelect
            selectFor="Visibility"
            items={["Public", "private", "Password"]}
          />
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
