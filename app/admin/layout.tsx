import { ReactNode } from "react";
import { getSessionUser } from "@/utils/getSessionUser";
import { redirect } from "next/navigation";

import pathName from "@/constants";
import LeftSideBar from "@/components/Layout/LeftSidebar";
import FullWidthLayout from "@/components/Layout/FullWidthLayout";

export default async function adminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userData = await getSessionUser();
  if (!userData) {
    redirect(pathName.login.path);
  }
  return (
    <LeftSideBar userData={userData}>
      <FullWidthLayout>{children}</FullWidthLayout>
    </LeftSideBar>
  );
}
