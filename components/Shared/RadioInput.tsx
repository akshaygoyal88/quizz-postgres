import React from "react";

export default function RadioInput({
  id,
  value,
  checked,
  handleAnyTypeRadioChange,
  label,
  name,
  htmlFor,
}: {
  id: string;
  value: string;
  checked: boolean;
  handleAnyTypeRadioChange: () => void;
  label: string;
  name: string;
  htmlFor: string;
}) {
  return (
    <div>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={handleAnyTypeRadioChange}
      />
      <label htmlFor={htmlFor} className="ml-2">
        {label}
      </label>
    </div>
  );
}
