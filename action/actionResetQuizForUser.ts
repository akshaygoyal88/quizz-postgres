"use server"

import { updateQuizReportByReportId } from "@/services/quizReport";
import { ReportStatusE, UserQuizStatusE } from "@prisma/client";



export async function handleResetQuizForCandidate(formData: FormData) {
    const { id } = Object.fromEntries(
      formData.entries()
    ) as {
      id: string;
    };

    return await updateQuizReportByReportId({id, quizOwnerStatus: ReportStatusE.INITIALIZED, candidateStatus:UserQuizStatusE.INPROGRESS })
  
    
  }
  