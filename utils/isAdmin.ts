import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSessionUser } from "./getSessionUser";

export async function isAdmin(redirectTo: string) {
  const userData = await getSessionUser();
  if (userData?.role !== UserRole.ADMIN) redirect("/");
}
