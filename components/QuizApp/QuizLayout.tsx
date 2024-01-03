// components/QuizLayout.js
import React from "react";
import SideBar from "./SideBar";

const QuizLayout = ({ children }) => {
  return (
    <div className="flex h-full">
      <div className="w-64">
        <SideBar />
      </div>
      <main className="w-full h-full items-center align-middle ">
        {children}
      </main>
    </div>
  );
};

export default QuizLayout;
