"use client";

import React, { useState } from "react";
import QuizLayout from "./QuizLayout";

function AddObjective() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [validationError, setValidationError] = useState("");
  const type = "objective";

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

    const requestData = {
      question: question,
      options: [...options],
      type: type,
      correctAnswer: correctAnswer,
    };

    try {
      //   const adminToken = localStorage.getItem("codeCaiffieneToken");
      const response = await fetch("/api/quiz/save-objective", {
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

      if (response.ok) {
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer(null);
        setValidationError("");
      } else {
        alert("Failed to save the question.");
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  return (
    <QuizLayout>
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
        <div>
          <label className="block text-lg font-semibold">Question:</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 mt-2"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Question"
          />
        </div>
        <div className="mt-4">
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
        </div>
        <div className="text-red-500 mt-2">{validationError}</div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSaveQuestion}
            className=" bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg"
          >
            Save Question
          </button>
        </div>
      </div>
    </QuizLayout>
  );
}

export default AddObjective;
