import React from "react";

export default function ShadowSection({
  children,
  classForSec,
}: {
  children: React.ReactNode;
  classForSec?: string;
}) {
  return (
    <div
      className={`${classForSec} bg-white rounded-lg shadow-lg overflow-hidden`}
    >
      {children}
    </div>
  );
}
