import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

export async function isAdmin(redirectTo: string) {
    const session = await getSession();
    const ses = await getServerSession()
    console.log(session)
    // if(session?.role !== UserRole.ADMIN) redirect(redirectTo)
}
