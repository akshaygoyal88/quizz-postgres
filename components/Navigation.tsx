"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navigation({ session }: { session: Session | null }) {
  const router = useRouter();

  const userId = "clq511pdy0000op42iuzmwsej";

  return (
    <div className="bg-gray-800 p-4 flex items-center justify-between">
      <h1 className="text-white text-xl font-bold">App</h1>
      <div className="flex gap-4">
        <Link href="/" className="text-white">
          Home
        </Link>
        <Link href="/tickets" className="text-white">
          Ticket
        </Link>
        <Link href={`/user/${userId}/show`} className="text-white">
          Add-Show
        </Link>
        <Link href={`/user/${userId}/tickets`} className="text-white">
          Add-Ticket
        </Link>

        {session && (
          <Link href="/dashboard" className="text-white">
            Dashboard
          </Link>
        )}
        {session && (
          <Link href="/profile" className="text-white">
            Profile
          </Link>
        )}
      </div>
      {session ? (
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => router.push("/signin")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Sign in
        </button>
      )}
    </div>
  );
}
