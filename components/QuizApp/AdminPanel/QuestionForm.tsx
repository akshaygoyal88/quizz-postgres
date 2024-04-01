"use client";

import React, { useEffect, useState } from "react";
import { AnswerTypeE, QuestionType, Quiz } from "@prisma/client";
import { handleQuestionSubmit } from "@/action/actionsQuesForm";
import { QuestionSubmitE } from "@/services/questions";
import TinyMCEEditor from "../../Shared/TinyMCEEditor";
import SimpleToggle from "../../Shared/SimpleToggle";
import { Button } from "../../Shared/Button";
import RadioInput from "../../Shared/RadioInput";
import Lable from "../../Shared/Lable";
import { QuestionsTypes, UserDataType, imageS3 } from "@/types/types";
import Form from "@/components/Shared/Form";
import Heading from "@/components/Shared/Heading";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

interface QuestionFormProps {
  defaultQuestionSet?: Quiz | null;
  quizzes: Quiz[] | null;
  buttonText: string;
  headingText: string;
  action: QuestionSubmitE;
  quesId?: string;
  editorsContent?: string;
  objAnsType: AnswerTypeE;
  imagesList: imageS3[] | null;
  userData: UserDataType;
  editQuestionData?: QuestionsTypes;
  editQuesOptions?: string[];
  correctAnsList?: string[];
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  defaultQuestionSet,
  quizzes,
  buttonText,
  headingText,
  action,
  quesId,
  editorsContent,
  imagesList,
  userData,
  editQuestionData,
  editQuesOptions,
  correctAnsList,
}) => {
  const [options, setOptions] = useState<(string | null)[]>(
    editQuesOptions || [""]
  );
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<string[]>(
    correctAnsList || []
  );
  const [validationError, setValidationError] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>(
    editQuestionData?.type || QuestionType.OBJECTIVE
  );
  const [objAnsType, setObjAnsType] = useState<string>(
    editQuestionData?.answer_type || AnswerTypeE.SINGLECHOICE
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string | null>(
    editQuestionData?.editorContent || null
  );
  const [savedOptions, setSavedOptions] = useState<(string | null)[]>([]);
  const [desEditorContent, setDesEditorContent] = useState<string | null>(
    editQuestionData?.solution || null
  );
  const [selectedQuiz, serSelectedQuiz] = useState<
    { value: string; label: string }[]
  >([]);

  const handleAnyTypeRadioChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (
      objAnsType === AnswerTypeE.MULTIPLECHOICE &&
      correctAnswerIndex.length > 1
    ) {
      setValidationError("Please select only one option for single choice");
      setTimeout(() => {
        setValidationError("");
      }, 8000);
      return;
    }
    setObjAnsType(event.target.value);
  };
  const handleCorrectOptionChange = (index: number) => {
    const idxStr = index.toString();
    if (
      (objAnsType === AnswerTypeE.MULTIPLECHOICE ||
        correctAnswerIndex.length == 0) &&
      !correctAnswerIndex.includes(idxStr)
    ) {
      setCorrectAnswerIndex([...correctAnswerIndex, idxStr]);
    } else if (
      objAnsType === AnswerTypeE.SINGLECHOICE &&
      correctAnswerIndex.length === 0
    ) {
      setCorrectAnswerIndex([idxStr]);
    } else {
      const updated = correctAnswerIndex.filter((i) => i !== idxStr);
      setCorrectAnswerIndex(updated);
    }
    setTimeout(() => {
      setValidationError("");
    }, 10000);
  };

  const handleOptionTextChange = (
    content: string,
    index?: number,
    editor?: string
  ) => {
    error && setValidationError("");
    const newOptions = [...options];
    newOptions[index!] = content;
    setOptions(newOptions);
  };

  const handleOptionIncrease = () => {
    setOptions([...options, null]);
  };

  const handleOptionRemove = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  useEffect(() => {
    if (options.length > 0) {
      setSavedOptions([...options]);
    }
  }, [options.length]);
  const handleEditorChange = (content: string, editor: any) => {
    setEditorContent(content);
  };
  const handleDesChange = (content: string, editor: any) => {
    setDesEditorContent(content);
  };

  const handleChange = (
    selectedOptions: { value: string; label: string }[]
  ) => {
    serSelectedQuiz(selectedOptions);
  };

  const formAction = async (formData: FormData) => {
    setError(null);
    formData.append("editorContent", editorContent as string);
    formData.append("createdById", userData.id as string);
    action == QuestionSubmitE.EDIT && formData.append("id", quesId as string);

    selectedQuiz.forEach((quiz) => {
      formData.append(`quizId_${quiz.label}`, quiz.value);
    });

    correctAnswerIndex?.forEach((ele: string) =>
      formData.append(`correctAnswer_${ele}`, ele as string)
    );
    if (desEditorContent) {
      formData.append("solution", desEditorContent as string);
    }
    options.forEach((option, i) =>
      formData.append(`questionOptions_${i}`, option!)
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
  return (
    <Form action={formAction} error={error} success={successMessage}>
      <div className="flex flex-wrap justify-between items-center mb-2 lg:flex-row">
        <Heading headingText={headingText} tag={"h2"} />
        <Button color="blue">{buttonText}</Button>
      </div>
      <div className="mb-4 bg-gray-100 p-3 rounded-md">
        <Lable labelText="Question:" htmlFor="ques" />
        <TinyMCEEditor
          editorsContent={editQuestionData?.editorContent}
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
                onChange={(e) => setQuestionType(e.target.value)}
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
              defaultValue={0}
              name="timer"
            />
          </div>
          <SelectSet
            defaultValue={defaultQuestionSet?.name}
            quizzes={quizzes}
            handleChange={handleChange}
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
          editorsContent={editQuestionData?.solution}
          handleEditorChange={handleDesChange}
          imagesList={imagesList}
          idx={"sol"}
        />
      </div>
    </Form>
  );
};

export default QuestionForm;

function SelectSet({
  defaultValue,
  quizzes,
  handleChange,
}: {
  defaultValue?: string;
  quizzes: Quiz[] | null;
  handleChange: () => void;
}) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <Lable labelText="Quiz:" />
      <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={[]}
        isMulti
        options={quizzes?.map((i) => ({ value: i.id, label: i.name }))}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}

function OptionCard({
  index,
  correctAnswerIndex,
  handleCorrectOptionChange,
  handleOptionRemove,
  imagesList,
  savedOptions,
  buttonText,
  handleOptionTextChange,
}: {
  index: number;
  correctAnswerIndex?: string[];
  handleCorrectOptionChange: (index: number) => void;
  handleOptionRemove: (index: number) => void;
  imagesList?: imageS3[] | null;
  savedOptions?: (string | null)[];
  buttonText: string;
  handleOptionTextChange: (
    content: string,
    index?: number,
    editor?: string
  ) => void;
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
          editorsContent={savedOptions![index]}
          index={index}
          idx={index + buttonText}
          handleEditorChange={handleOptionTextChange}
        />
      </div>
    </div>
  );
}
