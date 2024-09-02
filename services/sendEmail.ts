import sgMail from "@/utils/sendgrid";
import { getUserById } from "./user";


interface EmailOptions {
  to: string  ;
  subject: string;
  templateId: string, 
  dynamicTemplateData: object
}

const templateIds = {
  // SENDGRID_API_KEY: "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",
  VERIFICATION_EMAIL_TEMP_ID: "d-f3dd9519202a412f8a60c864b7eb862f",
  SUCCESSFULLY_VERIFIED_TEMP_ID: "d-8a9750e55df744d995993b29cd119b15",
  SIGNUP_WELCOME_TEMP_ID: "d-2e30db6033ac4d168473ac0db15323f7",
  RESETPASSWORD_EMAIL_TEMP_ID: "d-2c39dc705c5949f58ee2502539392930",
  TEST_REPORT_TEMP_ID: "d-70e7cc0b86904cb58190d75cab8623a6",
  TEST_SUBMISSION_TEMP_ID: "d-e9a544b113b0477c805634a3e22cb953"
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

// export async function sendEmailToUser({userId, subject,templateId, dynamicTemplateData }:{userId:string, subject:string,templateId: string, dynamicTemplateData: {[key:string]:string}}) {

//   const userData = await getUserById(userId);

//   const msg = {
//     to: userData.email,
//     subject,
//     templateId: templateIds[templateId],
//     dynamicTemplateData,
//     text: "",
//   };
//   try {
//     await sendEmail(msg);
//   } catch (error) {
//     if (error && typeof error === "object") {
//       console.error("An error occurred:", error);
//     } else {
//       console.error("An unexpected error occurred:", error);
//     }
//   }
// }

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