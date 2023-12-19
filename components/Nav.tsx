import { getServerSession } from "next-auth/next";
import Navigation from "./Navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  return <Navigation session={session} />;
}
