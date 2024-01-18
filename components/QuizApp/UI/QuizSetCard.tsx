// QuestionSetCard.tsx

import { QuestionSet } from "@/types"; // Assuming you have a 'types' directory for your models
import Link from "next/link";

interface QuizSetCardProps {
  questionSet: QuestionSet;
  // questionCount: number; // Assuming you have a way to get the question count for each set
}

const QuizSetCard: React.FC<QuizSetCardProps> = ({
  questionSet,
  // questionCount,
}) => {
  const formattedDate = new Date(questionSet.createdAt).toLocaleDateString();

  return (
    <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{questionSet.name}</h2>
        <p className="text-gray-600">{questionSet.description}</p>
      </div>
      <div className="p-4 bg-gray-100 border-t border-gray-200">
        <p className="text-gray-600">
          created by:{" "}
          {questionSet.createdBy.first_name || questionSet.createdBy.email}
        </p>
        <p className="text-xs text-gray-500">Created on {formattedDate}</p>
        <p className="text-xs text-gray-500">Number of Questions: 0</p>
        <Link href={`/quiz/${questionSet.id}`}>
          <p className="text-indigo-600 hover:underline">View Details</p>
        </Link>
      </div>
    </div>
  );
};

export default QuizSetCard;
