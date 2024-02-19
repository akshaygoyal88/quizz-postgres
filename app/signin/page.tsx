import LoginForm from "@/components/LoginForm";
import React from "react";
import authorization from "../authorization";
import pathName from "@/constants";
import { SlimLayout } from "@/components/SlimLayout";

export default async function login() {
  await authorization({ redirectTo: pathName.home.path });
  return (
    <SlimLayout>
      <LoginForm />
    </SlimLayout>
  );
}
