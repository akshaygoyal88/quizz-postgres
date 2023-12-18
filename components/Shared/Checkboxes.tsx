export default function Checkboxes({
  id,
  type,
  label,
  name,
  checked,
  value,
  onChange,
  className,
}: {
  id?: string;
  type: string;
  label?: string;
  name?: string;
  checked: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Changed the return type to void
  className?: string;
}) {
  return (
    <>
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id={id}
            aria-describedby="comments-description"
            name={name}
            type={type}
            className={
              className
                ? className
                : "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            }
            defaultChecked={checked}
            value={value}
            onChange={onChange}
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor={id} className="font-medium text-gray-900">
            {label}
          </label>
        </div>
      </div>
    </>
  );
}
