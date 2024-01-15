// "use client";

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

export default function Button({ href }: { href: string }) {
  return (
    <Link
      type="button"
      href={href}
      className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Add Questions
    </Link>
  );
}
