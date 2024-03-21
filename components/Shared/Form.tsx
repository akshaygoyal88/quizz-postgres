import React, { Children, FormEvent, JSXElementConstructor } from "react";
import InputWithLabel from "./InputWithLabel";

export interface InputItemTypes {
  type: string;
  name: string;
  label?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string | undefined;
  otherText?: string | undefined;
  onChange?: (e: FormEvent) => void;
  value?: string;
  maxLength?: number;
  disabled?: boolean;
}

export default function Form({
  classes,
  action,
  method,
  error,
  inputsForForm,
  success,
  button,
  onSubmit,
  gridClassesForBtn,
  children,
}: {
  classes: string;
  action?: (formData: FormData) => void;
  method?: string;
  error: string | null;
  success?: string | null;
  button?: JSX.Element[];
  inputsForForm?: InputItemTypes[];
  onSubmit?: (e: FormEvent) => void;
  gridClassesForBtn?: string;
  children?: React.ReactNode;
}) {
  return (
    <form
      className={classes}
      action={action}
      method={method}
      onSubmit={onSubmit}
    >
      {children}
      {inputsForForm && <FormInputs inputList={inputsForForm} />}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <div
        className={
          gridClassesForBtn
            ? gridClassesForBtn
            : "grid gap-4 grid-cols-2 sm:grid-cols-1"
        }
      >
        {button?.map((btn, index) => (
          <React.Fragment key={index}>{btn}</React.Fragment>
        ))}
      </div>
    </form>
  );
}

export function FormInputs({ inputList }: { inputList: InputItemTypes[] }) {
  return (
    <>
      {inputList.map((inputContent, index) => (
        <InputWithLabel
          key={inputContent.id}
          type={inputContent.type}
          name={inputContent.name}
          label={inputContent.label}
          id={inputContent.id}
          placeholder={inputContent.placeholder}
          defaultValue={inputContent.defaultValue}
          otherText={inputContent.otherText}
          className="block w-full rounded-md border-0 p-1.5 pr-10 ring-1 ring-inset sm:text-sm sm:leading-6"
          onChange={inputContent.onChange}
          value={inputContent.value}
          maxLength={inputContent.maxLength}
          disabled={inputContent.disabled}
        />
      ))}
    </>
  );
}
