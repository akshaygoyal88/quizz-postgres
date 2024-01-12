import { getServerSession } from "next-auth";
import { db } from "../db";

export async function getUserData() {
  const session = await getServerSession();

  if (session && session.user) {
    const email = session.user.email;
    if (email) {
      const userData = await db.user.findUnique({
        where: { email },
      });

      return userData;
    }
  }

  throw new Error("User data not found");
}
