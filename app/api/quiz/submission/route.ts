import { submitAnswers } from '@/services/answerSubmission';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const reqData = await req.json();
    const submitRes = await submitAnswers(reqData);
    return NextResponse.json(submitRes);
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, 500);
  }
}
