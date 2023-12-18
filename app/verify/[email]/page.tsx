import VerifyForm from "@/components/VerifyForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

interface VerifyProps {
  params: {
    email: string;
  };
}

export default async function Verify({ params }: VerifyProps) {
  const session = await getServerSession();
  if (session) {
    redirect("/profile");
  }
  const decodedEmail = decodeURIComponent(params.email);

  return <VerifyForm email={decodedEmail} />;
}
