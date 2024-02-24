import React from "react";

export default function Lable({
  labelText,
  htmlFor,
}: {
  labelText: string;
  htmlFor?: string;
}) {
  return (
    <label className="block text-lg font-semibold" htmlFor={htmlFor}>
      {labelText}
    </label>
  );
}
