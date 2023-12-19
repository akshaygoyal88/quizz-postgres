import LoginForm from "@/components/LoginForm";
import React from "react";
import authorization from "../authorization";

export default async function login() {
  await authorization({ redirectTo: "/" });
  return <LoginForm />;
}
