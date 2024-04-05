import sgMail from "@/utils/sendgrid";
import { getUserById } from "./user";


interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  templateId: string, 
  dynamicTemplateData: object
}

export default async function sendEmail({ to, subject, templateId, dynamicTemplateData}: EmailOptions) {
  const msg = {
    to,
    from: 'knipoint@gmail.com',
    templateId,
    dynamicTemplateData,
    subject,
    // text,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw error;
  }
};

export async function sendEmailToUser({userId, subject,templateId, dynamicTemplateData }:{userId:string, subject:string,templateId: string, dynamicTemplateData: {[key:string]:string}}) {

  const userData = await getUserById(userId);

  const msg = {
    to: userData.email,
    subject,
    templateId,
    dynamicTemplateData,
    text: "",
  };
  try {
    await sendEmail(msg);
  } catch (error) {
    if (error && typeof error === "object") {
      console.error("An error occurred:", error);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

// !quizReportRes.error && await sendEmailToUser({
//   userId: submittedBy,
//   subject: "Test Report",
//   templateId: process.env.TEST_REPORT_TEMP_ID || "",
//   dynamicTemplateData: {
//   quiz_name: quizData?.name,
//   status: "Report " + quizReportRes.quizOwnerStatus,
//   attempt_date: formattedDate(quizReportRes.candidateQuizStartTime),
//   obtMarks: quizReportRes.obtMarks?.toString() || "",
//   totalMarks: quizReportRes.totalMarks?.toString() || "",
//   link_of_report: `${process.env.NEXT_PUBLIC_BASE_URL}/${submittedBy}/reports/${quizId}`
//   },
// });