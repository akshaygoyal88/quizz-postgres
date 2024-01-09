"use client";

import React, { useState } from "react";
import QuizLayout from "./QuizLayout";

const AddSubjectiveQues = () => {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const type = "SUBJECTIVE";

  const handleQuestionChange = (e: any) => {
    setQuestion(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleSaveQuestion = async () => {
    if (!question || !description) {
      setError("Both fields are compulsory");
      return;
    }

    try {
      setError("");

      // const adminToken = localStorage.getItem("codeCaiffieneToken");

      // console.log(adminToken, "adminToken");

      const requestData = {
        question: question,
        description: description,
        type: type,
      };

      const response = await fetch("/api/quiz/save-subjective", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${adminToken}`,
        },
      });

      console.log(response, "response");

      setQuestion("");
      setDescription("");
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
    }
  };

  return (
    // <QuizLayout>
    <div className="p-3">
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="question"
        >
          Question
        </label>
        <input
          className="w-full px-3 py-6 border rounded-lg focus:outline-none focus:shadow-outline"
          id="question"
          name="question"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Write Problem statement here...."
        />
      </div>

      <div>
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
          // row="10"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Write Description for Problem statement here...."
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSaveQuestion}
          className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg"
        >
          Save Question
        </button>
      </div>
    </div>
    // </QuizLayout>
  );
};

export default AddSubjectiveQues;
