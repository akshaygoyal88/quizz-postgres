import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function login() {
  const session = await getServerSession();
  if (session) redirect("/");
  return <LoginForm />;
}
