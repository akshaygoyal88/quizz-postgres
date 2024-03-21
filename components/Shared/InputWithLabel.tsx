import { useState, ChangeEvent } from "react";

interface inputTypesProps {
  type: string;
  name: string;
  label?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  value?: string | number | undefined;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  errors?: string;
  maxLength?: number;
  otherText?: string;
  inputMode?: string;
  readOnly?: boolean;
  disabled?: boolean;
  min?: string | number;
  impAsterisk?: string;
  step?: string;
}

export default function InputWithLabel({
  type,
  name,
  label,
  id,
  placeholder,
  defaultValue,
  className,
  value,
  onChange,
  errors,
  maxLength,
  otherText,
  inputMode,
  readOnly,
  min,
  disabled,
  impAsterisk,
  step,
}: inputTypesProps) {
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div>
      {label && (
        <label
          htmlFor={type}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {impAsterisk && <span className="text-red-500">{impAsterisk}</span>}
          {label}
          <p className="text-gray-600 text-xs">{otherText}</p>
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={id}
          className={`${className} ${
            errors
              ? "text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500"
              : ""
          }`}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-invalid="true"
          aria-describedby="email-error"
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          // inputMode={inputMode}
          readOnly={readOnly}
          disabled={disabled}
          min={min}
          max={maxLength}
          step="0.1"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"></div>
      </div>
      {errors && (
        <div className="pt-1">
          {errors.split("/").map((err, i) => (
            <li key={i} className="w-full text-xs text-red-600">
              {err}
            </li>
          ))}
        </div>
      )}
    </div>
  );
}
