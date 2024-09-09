import { getQuizQuestions, deleteQuiz } from "@/services/quiz";
import { NextRequest, NextResponse } from "next/server";

// Handle GET requests
export async function GET(request: NextRequest) {
  try {
    // Extract the quizId from the URL
    const url = new URL(request.url);
    const quizId = url.pathname.split("/").pop(); // Extract the quizId from the URL path

    if (!quizId) {
      return NextResponse.json({ error: "Invalid quiz set." }, { status: 400 });
    }

    const getQuizAndQues = await getQuizQuestions({ quizId });

    return NextResponse.json({ questions: getQuizAndQues });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { error: "Error fetching quiz questions" },
      { status: 500 }
    );
  }
}

// Handle DELETE requests
export async function DELETE(request: NextRequest) {
  try {
    // Extract the quizId from the URL
    const url = new URL(request.url);
    const quizId = url.pathname.split("/").pop(); // Extract the quizId from the URL path

    if (!quizId) {
      return NextResponse.json({ error: "Invalid quiz set." }, { status: 400 });
    }

    const deleteQuizs = await deleteQuiz({ setId: quizId });

    return NextResponse.json(deleteQuizs);
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: "Error deleting quiz" }, { status: 500 });
  }
}
