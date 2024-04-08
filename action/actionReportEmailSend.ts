"use server";

import { getQuizByQuizId } from "@/services/quiz";
import { getReportByQuizIdAndSubmittedBy } from "@/services/quizReport";
import sendEmail from "@/services/sendEmail";
import { getUserById } from "@/services/user";
import { formattedDate } from "@/utils/formattedDate";
import { ReportStatusE } from "@prisma/client";

export async function handleReportSendEmail(formData: FormData) {
  const { subject, candidateId, quizId } = Object.fromEntries(
    formData.entries()
  ) as {
    subject: string;
    candidateId: string;
    quiz_name: string;
    quizId: string;
  };

  const userData = await getUserById(candidateId);
  const quizDetail = await getQuizByQuizId(quizId);
  const report = await getReportByQuizIdAndSubmittedBy({ candidateId, quizId });
  if(report?.quizOwnerStatus !== ReportStatusE.GENERATED){
    return {error: "Please generate a report than only send email reports."}
  }
  const dynamicTemplateData = {
    quiz_name: quizDetail?.name,
    status: `Report Generated`,
    attempt_date: formattedDate(report?.candidateQuizStartTime!),
    obtMarks: report?.obtMarks?.toString() || "",
    totalMarks: report?.totalMarks?.toString() || "",
    link_of_report: `${process.env.NEXT_PUBLIC_BASE_URL}/${candidateId}/reports/${quizId}`,
  };

  try {
    const reportEmailRes = await sendEmail({
      to: userData.email,
      subject,
      templateId: process.env.TEST_REPORT_TEMP_ID || "",
      dynamicTemplateData,
    });
    if (reportEmailRes!) {
      return { message: "Email sent successfully" };
    }
  } catch (error) {
    if (error && typeof error === "object") {
      console.error("An error occurred:", error);
      return {"An error occurred:": error}
    } else {
      console.error("An unexpected error occurred:", error);
      return {"An unexpected error occurred:": error}
    }
  }
}
