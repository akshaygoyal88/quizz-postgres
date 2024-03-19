import { getUserByEmail } from "@/services/user";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function getSessionUser() {
    const session = await getServerSession();
    if(session) {
        return await getUserByEmail(session?.user?.email || "");
    } else {
        return null;
    }
}