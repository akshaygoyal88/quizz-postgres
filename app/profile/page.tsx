import Profile from "@/components/Profile";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import authorization from "../authorization";
import LeftSideBar from "@/components/Layout/LeftSidebar";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/signin");
  const email = session!.user!.email!;
  return (
    <LeftSideBar>
      <Profile email={email} />
    </LeftSideBar>
  );
}
