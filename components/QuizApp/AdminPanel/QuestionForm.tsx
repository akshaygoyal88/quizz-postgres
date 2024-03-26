import React, { useEffect, useState } from "react";
import { AnswerTypeE, QuestionType, Quiz } from "@prisma/client";
import { handleQuestionSubmit } from "@/action/actionsQuesForm";
import { QuestionSubmitE } from "@/services/questions";
import { useSession } from "next-auth/react";
import TinyMCEEditor from "../UI/TinyMCEEditor";
import SimpleToggle from "../../Shared/SimpleToggle";
import { Button } from "../../Button";
import RadioInput from "../../Shared/RadioInput";
import Lable from "../../Shared/Lable";
import { imageS3 } from "@/types/types";

interface QuestionFormProps {
  options: string[];
  correctAnswerIndex: number | null;
  validationError: string;
  questionType: QuestionType;
  description: string;
  defaultQuestionSet?: Quiz | null;
  timer: string;
  successMessage: string;
  quizzes: Quiz[] | null;
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
  options,
  correctAnswerIndex,
  validationError,
  questionType,
  description,
  defaultQuestionSet,
  timer,
  quizzes,
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
  objAnsType,
}) => {
  const session = useSession();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string | null>(null);
  const [savedOptions, setSavedOptions] = useState<string[]>([]);
  const [desEditorContent, setDesEditorContent] = useState<string | null>(null);
  const [imagesList, setImagesList] = useState<imageS3[] | null>(null);

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
      setError(error);
      console.error("Error fetching images from S3:", error);
    }
  };

  const formAction = async (formData: FormData) => {
    setError(null);
    formData.append("editorContent", editorContent as string);
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
  };
  const handleDesChange = (content: string, editor: any) => {
    setDesEditorContent(content);
  };
  return (
    <form action={formAction} className="m-4">
      <div className="flex flex-wrap justify-between items-center lg:flex-row">
        <h1 className="text-lg font-semibold">{headingText}</h1>
        <Button color="blue">{buttonText}</Button>
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
        <Lable labelText="Question:" htmlFor="ques" />
        <TinyMCEEditor
          editorsContent={editorsContent}
          handleEditorChange={handleEditorChange}
          imagesList={imagesList}
          idx={"ques"}
        />
        <div className="">
          <div className="flex items-center gap-5">
            <Lable labelText="Question Type:" htmlFor="questionType" />
            <div>
              <select
                className="w-48 m-2 block rounded-md border-0 py-2 pl-0.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={questionType}
                name="questionType"
                // onChange={handleRadioChange}
              >
                <option value={QuestionType.OBJECTIVE}>Objective</option>
                <option value={QuestionType.SUBJECTIVE}>Subjective</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Lable labelText="Timer (in secs):" htmlFor="timer" />
            <input
              type="number"
              className="w-48 m-2 block rounded-md border-0 py-1.5 pl-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={timer}
              name="timer"
            />
          </div>
          <SelectSet
            defaultValue={defaultQuestionSet?.name}
            quizzes={quizzes}
          />
        </div>
        {questionType === QuestionType.OBJECTIVE && (
          <div className="my-4 flex gap-4">
            <Lable
              labelText="Is this question has multiple correct answers?"
              htmlFor="answer_type"
            />
            <RadioInput
              id="SingleCorrect"
              value={AnswerTypeE.SINGLECHOICE}
              checked={objAnsType === AnswerTypeE.SINGLECHOICE}
              handleAnyTypeRadioChange={handleAnyTypeRadioChange}
              name="answer_type"
              htmlFor="SingleCorrect"
              label="No"
            />
            <RadioInput
              id="MultipleCorrect"
              value={AnswerTypeE.MULTIPLECHOICE}
              checked={objAnsType === AnswerTypeE.MULTIPLECHOICE}
              handleAnyTypeRadioChange={handleAnyTypeRadioChange}
              name="answer_type"
              htmlFor="MultipleCorrect"
              label="Yes"
            />
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
            <OptionCard
              option={option}
              index={index}
              correctAnswerIndex={correctAnswerIndex}
              handleCorrectOptionChange={handleCorrectOptionChange}
              handleOptionRemove={handleOptionRemove}
              imagesList={imagesList}
              savedOptions={savedOptions}
              buttonText={buttonText}
              handleOptionTextChange={handleOptionTextChange}
            />
          ))}
        </div>
      )}
      <div className="mt-4 p-3 bg-cyan-100 rounded-md">
        <Lable labelText="Solution:" />
        <TinyMCEEditor
          editorsContent={description}
          handleEditorChange={handleDesChange}
          imagesList={imagesList}
          idx={"sol"}
        />
      </div>
    </form>
  );
};

export default QuestionForm;

function SelectSet({
  defaultValue,
  quizzes,
}: {
  defaultValue?: string;
  quizzes: Quiz[] | null;
}) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <Lable labelText="Quiz:" />
      <select
        className="w-full border rounded-md p-2"
        defaultValue={defaultValue}
        name="quizId"
      >
        <option value="">Select Quiz</option>
        {quizzes &&
          quizzes.map((quiz: Quiz) =>
            !quiz.isDeleted ? (
              <option key={quiz.id} value={quiz.id}>
                {quiz.name}
              </option>
            ) : null
          )}
      </select>
    </div>
  );
}

function OptionCard({
  option,
  index,
  correctAnswerIndex,
  handleCorrectOptionChange,
  handleOptionRemove,
  imagesList,
  savedOptions,
  buttonText,
  handleOptionTextChange,
}: {
  option?: string;
  index: number;
  correctAnswerIndex?: string | null;
  handleCorrectOptionChange: (index: number) => void;
  handleOptionRemove: (index: number) => void;
  imagesList?: imageS3[] | null;
  savedOptions?: string[];
  buttonText: string;
  handleOptionTextChange: () => void;
}) {
  return (
    <div key={index} className="flex flex-col mb-3 p-3 bg-blue-50 rounded-md">
      <div className="flex justify-between">
        <Lable labelText={`Option:${index + 1}`} />
        <span className="flex items-center gap-5 py-2">
          <label>Is correct</label>
          <SimpleToggle
            checked={correctAnswerIndex?.includes(`${index}`)!}
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
  );
}
