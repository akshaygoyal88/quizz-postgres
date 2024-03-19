import clsx from "clsx";

export default function List({
  heading,
  description,
  features,
  classesForlist,
}: {
  heading?: string;
  description?: string | JSX.Element | JSX.Element[];
  features: Array<string>;
  classesForlist?: string;
}) {
  return (
    <section
      className={clsx(`flex flex-col rounded-3xl lg:py-2 ${classesForlist}`)}
    >
      {heading && (
        <h3 className="font-display text-3xl font-bold mb-4 text-slate-1000">
          {heading}
        </h3>
      )}
      {description && (
        <span className={clsx("mt-2 text-base text-slate-800")}>
          {description}
        </span>
      )}
      <ul
        role="list"
        className={clsx(
          "order-last mt-5 flex flex-col gap-y-3 text-sm text-slate-800"
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex">
            <span className="ml-4">{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
