import Profile from "@/components/Profile";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/signin");
  const email = session!.user!.email!;
  return <Profile email={email} />;
}
