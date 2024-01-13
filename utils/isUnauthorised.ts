import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";



export async function isUnauthorised(redirectTo: string) {
    const session = await getServerSession();
    if(!session) redirect(redirectTo)
}