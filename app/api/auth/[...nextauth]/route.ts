import NextAuth, { Account, NextAuthOptions, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { NotificationService, UserSerivce } from "@/services";
import { User } from "@prisma/client";
import { JWT } from "next-auth/jwt";

// import { PrismaAdapter } from "@next-auth/prisma-adapter";

const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(db),
  // session: {
  //   strategy: "jwt"
  // },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const email = credentials?.email;
        const user = await UserSerivce.getVerifiedUserByEmail({ email });

        if (user) {
          const passwordCorrect =
            (await compare(credentials?.password || "", user.password)) ||
            credentials.password === user.password;

          if (passwordCorrect) {
            if (user.isVerified) {
              if (!user?.isProfileComplete) {
                const userId: string = user?.id;
                const notificationAvailable =
                  await NotificationService.getNotifications(userId);
                if (Array.isArray(notificationAvailable)) {
                  const notiForProfile: any = notificationAvailable.find(
                    (noti) => noti?.message?.includes("Profile not completed")
                  );
                  if (!notiForProfile) {
                    await NotificationService.createNotiForProfileComplete(
                      userId
                    );
                  }
                }
              }
              return {
                id: user.id,
                email: user.email,
                isVerified: user.isVerified,
                first_name: user.first_name,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                profile_pic: user.profile_pic,
                isProfileComplete: user.isProfileComplete,
              };
            } else {
              throw new Error("User not verified.");
            }
            return {
              id: user.id,
              email: user.email,
              isVerified: user.isVerified,
              first_name: user.first_name,
              role: user.role,
              isActive: user.isActive,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              profile_pic: user.profile_pic,
              isProfileComplete: user.isProfileComplete,
              subscription: user.Subscription,
            };
          } else {
            throw new Error("Invalid password.");
          }
        } else {
          throw new Error("User not found or verify email before sign in.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      // console.log("jwtcallback", { token, user, session });
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          isVerified: user.isVerified,
          first_name: user.first_name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          profile_pic: user.profile_pic,
          isProfileComplete: user.isProfileComplete,
          subscription: user.Subscription,
        };
      }
      return token;
    },
    async session({ token, session }: { token: any; session: Object }) {
      // console.log("sessioncallback", { token, user, session });
      return {
        ...token,
        id: token.id,
        email: token.email,
        isVerified: token.isVerified,
        first_name: token.first_name,
        role: token.role,
        isActive: token.isActive,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
        profile_pic: token.profile_pic,
        isProfileComplete: token.isProfileComplete,
        subscription: token.Subscription,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
