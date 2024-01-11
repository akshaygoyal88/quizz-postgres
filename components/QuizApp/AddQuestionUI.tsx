"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Textarea from "../Shared/Textarea";
import { useFetch } from "@/hooks/useFetch";
import pathName from "@/constants";

interface availableSetTypes {
  name: string;
}

function AddQuestionUI() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [questionType, setQuestionType] = useState("objective");
  const [description, setDescription] = useState("");
  const [questionSet, setQuestionSet] = useState("");
  const [timer, setTimer] = useState("0");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { data, error, isLoading } = useFetch(
    `${pathName.questionSetApi.path}`
  );

  const handleRadioChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setQuestionType(event.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  console.log(description);

  const handleOptionChange = (index: any) => {
    setCorrectAnswer(index);
    setValidationError("");
  };

  const handleOptionTextChange = (index: any, option: any) => {
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
  };

  const handleSaveQuestion = async () => {
    console.log("saving");
    let requestData;

    if (questionType === "objective") {
      if (
        question.trim() === "" ||
        options.some((option) => option.trim() === "")
      ) {
        setValidationError(
          "Please fill in both the question and options before saving."
        );
        return;
      }

      if (correctAnswer === null) {
        setValidationError("Please select the correct answer.");
        return;
      }
      requestData = {
        question_text: question,
        options: [...options],
        type: "OBJECTIVE",
        correctAnswer: correctAnswer,
        questionSet: questionSet,
        timer: timer,
      };
    } else if (questionType === "subjective") {
      requestData = {
        question_text: question,
        type: "SUBJECTIVE",
        description: description,
        questionSet: questionSet,
        timer: timer,
      };
    }

    console.log("subjective", requestData);

    try {
      //   const adminToken = localStorage.getItem("codeCaiffieneToken");
      const response = await fetch(`${pathName.questionsApiPath.path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(requestData),
      });
      console.log(response);
      const data = await response.json();
      console.log(data);

      if (!data.error) {
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer(null);
        setValidationError("");
        setTimer("0");
        setQuestionSet("");
        setSuccessMessage("Successfully added Question.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 10000);
      } else {
        setValidationError(data.error);
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h1 className="text-lg font-semibold mb-4">Add Questions</h1>
      {/* Select Question Set */}
      <div className="mb-4">
        <select
          className="w-full border rounded-md p-2"
          onChange={(e) => setQuestionSet(e.target.value)}
          value={questionSet}
        >
          <option>Select question set</option>
          {data && data.map((set) => <option>{set.name}</option>)}
        </select>
      </div>
      {/* Question Input */}
      <div className="mb-4">
        <label className="block text-lg font-semibold">Question:</label>
        <Textarea
          className="w-full border rounded-md p-2 mt-2"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
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
            value="subjective"
            checked={questionType === "subjective"}
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
            value="objective"
            checked={questionType === "objective"}
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
          onChange={(e) => setTimer(e.target.value)}
        />
      </div>

      {/* Options for Objective Questions */}
      {questionType === "objective" && (
        <div className="mb-4">
          <label className="block text-lg font-semibold">Options:</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={option}
                placeholder={`Option ${index + 1}`}
                onChange={(e) => handleOptionTextChange(index, e.target.value)}
              />
              <label className="flex items-center space-x-2 p-4">
                <input
                  type="radio"
                  checked={correctAnswer === index}
                  onChange={() => handleOptionChange(index)}
                  className="form-radio text-blue-500 transform scale-125 font-bold"
                />
              </label>
            </div>
          ))}
          {/* Validation Error Message */}
          <div className="text-red-500 mb-2">{validationError}</div>
        </div>
      )}

      {/* Description for Subjective Questions */}
      {questionType === "subjective" && (
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
      {successMessage && (
        <p className="bg-green-500 py-2 px-4 m-2">{successMessage}</p>
      )}
      {/* Save Question Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSaveQuestion}
          className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg"
        >
          Save Question
        </button>
      </div>
    </div>
  );
}

export default AddQuestionUI;
