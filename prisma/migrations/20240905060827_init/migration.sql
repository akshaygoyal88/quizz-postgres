-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "UserOtpType" AS ENUM ('REGISTRATION_OTP', 'RESET_TOKEN');

-- CreateEnum
CREATE TYPE "QuizCreationStatusE" AS ENUM ('PUBLISH', 'DELETE', 'FREE', 'DRAFT');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('OBJECTIVE', 'SUBJECTIVE');

-- CreateEnum
CREATE TYPE "AnswerTypeE" AS ENUM ('SINGLECHOICE', 'MULTIPLECHOICE');

-- CreateEnum
CREATE TYPE "UserQuizAnswerStatus" AS ENUM ('NOT_ATTEMPTED', 'ATTEMPTED', 'REVIEW', 'SKIPPED');

-- CreateEnum
CREATE TYPE "UserQuizStatusE" AS ENUM ('SUBMITTED', 'INCOMPLETED', 'INPROGRESS');

-- CreateEnum
CREATE TYPE "ReportStatusE" AS ENUM ('GENERATED', 'UNDERREVIEW', 'INITIALIZED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mobile_number" TEXT,
    "address" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "pincode" TEXT,
    "profile_pic" TEXT DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg',
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "userImage" TEXT DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOtp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "otp" TEXT,
    "type" "UserOtpType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationTime" TIMESTAMP(3),

    CONSTRAINT "UserOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "price" DOUBLE PRECISION DEFAULT 0.0,
    "status" "QuizCreationStatusE",
    "select" BOOLEAN DEFAULT false,
    "cut" BOOLEAN DEFAULT false,
    "copy" BOOLEAN DEFAULT false,
    "paste" BOOLEAN DEFAULT false,
    "newWindow" BOOLEAN DEFAULT false,
    "newTab" BOOLEAN DEFAULT false,
    "globalTimer" INTEGER DEFAULT 0,
    "quizSubmissionMessage" TEXT,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question_text" TEXT,
    "type" "QuestionType" NOT NULL,
    "timer" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "editorContent" VARCHAR(1000),
    "createdById" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "solution" VARCHAR(1000),
    "answer_type" "AnswerTypeE",

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectiveOptions" (
    "id" TEXT NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,
    "option_marks" DOUBLE PRECISION DEFAULT 0.0,

    CONSTRAINT "ObjectiveOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestions" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "QuizQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuizAnswers" (
    "id" TEXT NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "status" "UserQuizAnswerStatus" DEFAULT 'NOT_ATTEMPTED',
    "ans_optionsId" TEXT,
    "ans_subjective" TEXT,
    "timeTaken" INTEGER,
    "timeOver" BOOLEAN DEFAULT false,
    "isCorrect" BOOLEAN DEFAULT false,
    "marks" DOUBLE PRECISION DEFAULT 0,
    "questions_marks" DOUBLE PRECISION DEFAULT 0,
    "isCurrent" BOOLEAN DEFAULT false,

    CONSTRAINT "UserQuizAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT,
    "isRead" BOOLEAN DEFAULT false,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuizReport" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "candidateStatus" "UserQuizStatusE",
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateQuizEndtime" TIMESTAMP(3),
    "obtMarks" DOUBLE PRECISION DEFAULT 0.0,
    "totalMarks" DOUBLE PRECISION DEFAULT 0.0,
    "quizOwnerStatus" "ReportStatusE" DEFAULT 'INITIALIZED',

    CONSTRAINT "UserQuizReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresOn" TIMESTAMP(3),
    "isApproved" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,
    "subscriptionStatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserOtp_userId_key" ON "UserOtp"("userId");

-- AddForeignKey
ALTER TABLE "UserOtp" ADD CONSTRAINT "UserOtp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectiveOptions" ADD CONSTRAINT "ObjectiveOptions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestions" ADD CONSTRAINT "QuizQuestions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestions" ADD CONSTRAINT "QuizQuestions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizAnswers" ADD CONSTRAINT "UserQuizAnswers_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizAnswers" ADD CONSTRAINT "UserQuizAnswers_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizReport" ADD CONSTRAINT "UserQuizReport_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
