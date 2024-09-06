import Profile from "@/components/Profile";
import { redirect } from "next/navigation";
import React from "react";
import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import { getSessionUser } from "@/utils/getSessionUser";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"; // or the correct import path

export default async function ProfilePage({ params }: Params) {
  const userData = await getSessionUser();
  if (!params.userId && !userData) redirect("/signin");
  if (userData) {
    return (
      <FullWidthLayout>
        <Profile userData={userData} />
      </FullWidthLayout>
    );
  }
}
