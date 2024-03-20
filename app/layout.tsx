import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/context/Provider";
import "./globals.css";
import { Header } from "@/components/NavHeader/Header";
import { getSessionUser } from "@/utils/getSessionUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getSessionUser();
  return (
    <html lang="en">
      <Provider>
        <body className="">
          <main>
            <Header userData={userData!} />
            {children}
          </main>
        </body>
      </Provider>
    </html>
  );
}
