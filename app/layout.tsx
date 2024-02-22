import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Provider from "@/context/Provider";
import "./globals.css";
import { Header } from "@/components/NavHeader/Header";

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
  return (
    <html lang="en">
      <Provider>
        <body className="">
          {/* <Nav /> */}
          <main>
            <Header />
            {children}
          </main>
        </body>
      </Provider>
    </html>
  );
}
