import { ChangeEvent } from "react";

export default function Textarea({
  label,
  rows,
  name,
  id,
  className,
  defaultValue,
  value,
  onChange,
}: {
  rows?: number;
  name?: string;
  id: string;
  className?: string;
  defaultValue?: string;
  label: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor="comment"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          rows={rows}
          name={name}
          id={id}
          className={className}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
