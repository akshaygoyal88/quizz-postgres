"use Client";

import React, { useState, ChangeEvent, KeyboardEvent } from "react";

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newTag = inputValue.trim();

      if (newTag !== "" && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }

      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  return (
    <div className="flex w-64 flex-col">
      <input
        type="text"
        placeholder="Enter tags..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
        className="w-full rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring"
      />
      <div className="my-4 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center rounded-md bg-blue-500 px-2 py-1 text-white"
          >
            <span className="mr-1">{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
