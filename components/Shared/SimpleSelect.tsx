export default function SimpleSelect({
  selectFor,
  items,
}: {
  selectFor: string;
  items: string[];
}) {
  return (
    <div className="flex items-center my-4">
      <label htmlFor="location" className="block text-lg font-semibold">
        {selectFor}
      </label>
      <select
        id="location"
        name="location"
        className="m-2 block w-full rounded-md border-0 py-1.5 pl-0.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        defaultValue=""
      >
        <option value="">Select</option>
        {items.map((item) => (
          <option>{item}</option>
        ))}
      </select>
    </div>
  );
}
