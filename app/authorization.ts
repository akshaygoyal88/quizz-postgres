import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function authorization({
  redirectTo
}: {
  redirectTo: string;
}) {
  const session = await getServerSession();
  console.log(session, "authorize")
  if (session) redirect(redirectTo); 
}
