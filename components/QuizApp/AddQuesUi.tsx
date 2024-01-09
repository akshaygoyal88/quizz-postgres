"use client";

import React, { useState } from "react";
import AddObjective from "./AddObjective";
import AddSubjectiveQues from "./AddSubjectiveQues";

export default function AddQuesUi() {
  const [questionType, setQuestionType] = useState("");

  const handleRadioChange = (event) => {
    setQuestionType(event.target.value);
  };

  console.log("Selected Question Type:", questionType);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle submission logic based on the selected question type
    console.log("Selected Question Type:", questionType);
  };

  return (
    <div>
      <h2>Add Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="radio"
            id="subjective"
            name="questionType"
            value="subjective"
            checked={questionType === "subjective"}
            onChange={handleRadioChange}
          />
          <label htmlFor="subjective">Subjective</label>
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
          <label htmlFor="objective">Objective</label>
        </div>
        {questionType === "objective" && <AddObjective />}
        {questionType === "subjective" && <AddSubjectiveQues />}
      </form>
    </div>
  );
}
