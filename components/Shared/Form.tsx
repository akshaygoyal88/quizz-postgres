import React from "react";
import InputWithLabel from "./InputWithLabel";

export interface InputItemTypes {
  type: string;
  name: string;
  label: string;
  id: string;
  placeholder: string;
  defaultValue?: string | undefined;
  otherText?: string | undefined;
}

export default function Form({
  classes,
  action,
  method,
  error,
  inputsForForm,
  success,
  button,
}: {
  classes: string;
  action: (formData: FormData) => void;
  method?: string;
  error: string | null;
  success?: string;
  button?: JSX.Element[];
  inputsForForm: InputItemTypes[];
}) {
  return (
    <form className={classes} action={action} method={method}>
      <FormInputs inputList={inputsForForm} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <div className="flex gap-4">{button?.map((btn) => btn)}</div>
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
        />
      ))}
    </>
  );
}
