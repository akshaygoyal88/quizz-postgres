import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import authorization from "../authorization";

export default async function Register() {
  const session = await getServerSession();
  if (session) redirect("/");

  return <RegisterForm />;
}
