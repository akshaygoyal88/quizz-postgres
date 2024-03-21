import { InputTypesProps } from "@/types/types";
import { ChangeEvent } from "react";

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
  readOnly,
  min,
  disabled,
  impAsterisk,
  step,
  selecItems,
  selectHeading,
}: InputTypesProps) {
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
        {type === "select" ? (
          <select
            id={id}
            name={name}
            className="m-2 block w-full rounded-md border-0 py-1.5 pl-0.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={defaultValue}
          >
            <option value="">{selectHeading}</option>
            {selecItems?.map((item: { value: string; title: string }) => (
              <option value={item.value} key={item.value}>
                {item.title}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            id={id}
            name={name}
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
            onChange={
              onChange as (event: ChangeEvent<HTMLTextAreaElement>) => void
            }
            maxLength={maxLength}
            readOnly={readOnly}
            disabled={disabled}
          />
        ) : (
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
            onChange={
              onChange as (event: ChangeEvent<HTMLInputElement>) => void
            }
            maxLength={maxLength}
            readOnly={readOnly}
            disabled={disabled}
            min={min}
            max={maxLength}
            step="0.1"
          />
        )}

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
