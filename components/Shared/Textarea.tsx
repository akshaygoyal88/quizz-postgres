/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export default function Textarea({
  rows,
  name,
  id,
  className,
  defaultValue,
}: {
  rows?: number;
  name: string;
  id: string;
  className?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label
        htmlFor="comment"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add your comment
      </label>
      <div className="mt-2">
        <textarea
          rows={rows}
          name={name}
          id={id}
          className={className}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
}
