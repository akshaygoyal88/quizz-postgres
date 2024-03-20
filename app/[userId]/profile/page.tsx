import Profile from "@/components/Profile";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import { getSessionUser } from "@/utils/getSessionUser";

export default async function ProfilePage() {
  const userData = await getSessionUser();
  if (!userData) redirect("/signin");
  const email = userData.email!;
  return (
    <FullWidthLayout>
      <Profile email={email} />
    </FullWidthLayout>
  );
}
