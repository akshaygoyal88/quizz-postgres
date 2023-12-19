export default function InputWithLabel({
  type,
  name,
  label,
  id,
  value,
  placeholder,
  defaultValue,
  className,
  inputMode,
  min,
  checked,
  onChange,
  readOnly
}: {
  type: string;
  name: string;
  label?: string;
  id?: string;
  value?: string | number;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  inputMode?: string;
  min?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm leading-6 text-gray-900  py-2 -sm font-semibold"
      >
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={id}
          className={className}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          inputMode={inputMode}
          onChange={onChange}
          aria-invalid="true"
          aria-describedby={`${name}-error`}
          min={min}
          checked={checked}
          readOnly={readOnly}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {/* Add any additional icons or elements here */}
        </div>
      </div>
      {/* Add an error message section here if needed */}
    </div>
  );
}
