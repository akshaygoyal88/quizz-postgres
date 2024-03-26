import React, { ReactNode } from "react";
import LeftSideBar from "@/components/Layout/LeftSidebar";
import { getSessionUser } from "@/utils/getSessionUser";
import FullWidthLayout from "@/components/Layout/FullWidthLayout";

export default async function adminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userData = await getSessionUser();
  if (!userData) {
    return <>Please Login</>;
  }
  return (
    <LeftSideBar userData={userData}>
      <FullWidthLayout>{children}</FullWidthLayout>
    </LeftSideBar>
  );
}
