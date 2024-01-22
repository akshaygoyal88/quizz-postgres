import Dashboard from "@/components/Dashboard";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function DashboardPage() {
  await isUnauthorised("/signin");
  return <Dashboard />;
}
