"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();

  const ses = useSession();
  const userId = ses?.data?.id;

  return (
    <div className="bg-gray-800 p-4 flex items-center justify-between">
      <h1 className="text-white text-xl font-bold">App</h1>
      <div className="flex gap-4">
        <Link href="/" className="text-white">
          Home
        </Link>
        {/* <Link href="/tickets" className="text-white">
          Tickets
        </Link> */}
        {/* <Link href="/shows" className="text-white">
          Shows
        </Link> */}
        {/* {ses.data && (
          <Link href={`/admin/${userId}/show`} className="text-white">
            Add Show
          </Link>
        )}
        {ses.data && (
          <Link href={`/admin/${userId}/tickets`} className="text-white">
            Add Ticket
          </Link>
        )} */}

        {ses.data && (
          <Link href="/dashboard" className="text-white">
            Dashboard
          </Link>
        )}
        {/* {ses.data && ( */}
        {ses.data && (
          <Link href="/admin/quiz" className="text-white">
            Quiz-app
          </Link>
        )}
        {ses.data && (
          <Link href="/profile" className="text-white">
            Profile
          </Link>
        )}
      </div>
      {ses.data ? (
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
