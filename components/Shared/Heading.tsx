import React from "react";

interface HeadingProps {
  headingText: string;
  tag: keyof JSX.IntrinsicElements;
}

export default function Heading({ headingText, tag = "h2" }: HeadingProps) {
  const Tag = tag;

  return (
    <Tag className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
      {headingText}
    </Tag>
  );
}
