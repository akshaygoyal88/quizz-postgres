import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/db";
import VerifyForm from "@/components/VerifyForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

interface VerifyProps {
  params: {
    email: string;
  };
}

const getUserExists = async (newEmail: string) => {
  const user = await db.user.findUnique({
    where: { email: newEmail },
  });
  return user;
};

export default async function Verify({ params }: VerifyProps) {
  const session = await getServerSession(authOptions);
  console.log("user========>", session);
  if (session) {
    redirect("/profile");
  }
  const decodedEmail = decodeURIComponent(params.email);

  const userExist = await getUserExists(decodedEmail);

  return <VerifyForm email={decodedEmail} user={userExist ? true : false} />;
}
