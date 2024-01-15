import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import VerifyForm from "@/components/VerifyForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { UserSerivce } from "@/Services";

interface VerifyProps {
  params: {
    email: string;
  };
}

const getUserExists = async (newEmail: string) => {
  return await UserSerivce.getUserByEmail(newEmail);
};

export default async function Verify({ params }: VerifyProps) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/profile");
  }
  const decodedEmail = decodeURIComponent(params.email);

  const userExist = await getUserExists(decodedEmail);

  return <VerifyForm email={decodedEmail} user={userExist ? true : false} />;
}
