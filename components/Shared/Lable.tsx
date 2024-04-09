import React from "react";

export default function Lable({
  labelText,
  htmlFor,
  classes,
}: {
  labelText: string;
  htmlFor?: string;
  classes?: string;
}) {
  return (
    <label
      className={`block text-lg font-semibold ${classes}`}
      htmlFor={htmlFor}
    >
      {labelText}
    </label>
  );
}
