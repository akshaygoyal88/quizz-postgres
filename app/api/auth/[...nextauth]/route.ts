import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "@/app/db";

export const authOptions: NextAuthOptions = {  
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const isVerified = true;
        const user = await db.user.findUnique({
          where: { email, isVerified },
        });

        if (user) {
          const passwordCorrect = await compare(
            credentials?.password || "",
            user.password,
          );

          if (passwordCorrect) {
            return {
              id: user.id,
              email: user.email,
              isVerified: user.isVerified,
            };
          } else {
            throw new Error("Invalid password");
          }
        } else {
          // User not found
          throw new Error(
            "User not found./Please check credentials or verify email before sign in.",
          );
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
