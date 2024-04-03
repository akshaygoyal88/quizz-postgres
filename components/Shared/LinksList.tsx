import Link from "next/link";
import React from "react";

interface LinksListProps {
  description?: string;
  link: string;
  href: string;
}

export default function LinksList({
  linksList,
}: {
  linksList: LinksListProps[];
}) {
  return (
    <>
      {linksList.map((item: LinksListProps) => (
        <span className="mt-4 flex align-middle justify-center text-md text-gray-700">
          {item.description}
          <Link href={item.href} className="text-blue-700 hover:underline">
            {item.link}
          </Link>
        </span>
      ))}
    </>
  );
}
