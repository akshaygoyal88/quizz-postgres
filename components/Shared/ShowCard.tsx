import Link from "next/link";

const ShowCard = ({ show }: { show: any }) => {
  const formattedStartDate = new Date(
    show.showStartDateAndTime
  ).toLocaleDateString();

  const formattedEndDate = new Date(
    show.showEndDateAndTime
  ).toLocaleDateString();

  // Calculate duration in minutes
  const durationInMinutes = Math.floor(
    (new Date(show.showEndDateAndTime) - new Date(show.showStartDateAndTime)) /
      (1000 * 60)
  );

  // Convert duration to hours and minutes format
  const durationInHours = Math.floor(durationInMinutes / 60);
  const durationInMinutesRemaining = durationInMinutes % 60;

  const randomQueryString = Math.random().toString();
  const lastDigit = parseInt(
    randomQueryString.charAt(randomQueryString.length - 1),
    10
  );

  return (
    <article
      key={show.id}
      className="flex flex-col items-start justify-between p-4 m-3 shadow-lg rounded-lg"
    >
      <div className="relative w-full">
        <img
          src={`https://source.unsplash.com/random/400x250?${lastDigit}`}
          alt=""
          className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div className="max-w-xl">
        <div className="mt-8 flex items-center gap-x-4 text-xs">
          <time dateTime={show.showStartDateAndTime} className="text-gray-500">
            {formattedStartDate}
          </time>
          {/* <span className="mx-2">to</span>
          <time dateTime={show.showEndDateAndTime} className="text-gray-500">
            {formattedEndDate}
          </time> */}
          <span className="mx-2 text-gray-500">
            Duration: {durationInHours}h {durationInMinutesRemaining}min
          </span>
          <Link
            href=""
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            {show.showType}
          </Link>
        </div>
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <Link href="">
              <span className="absolute inset-0" />
              {show.showName}
            </Link>
          </h3>
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
            Description of the show goes here.
          </p>
        </div>
        <div className="relative mt-8 flex items-center gap-x-4">
          <img
            src={`https://picsum.photos/seed/${show.showName}/200/200`}
            alt=""
            className="h-10 w-10 rounded-full bg-gray-100"
          />
          <div className="text-sm leading-6">
            <p className="font-semibold text-gray-900">
              <Link href="">
                <span className="absolute inset-0" />
                {/* Assuming show.author.name is available */}
                {/* Replace with actual show.author.name */}
                Author Name
              </Link>
            </p>
            <p className="text-gray-600">
              {/* Assuming show.author.role is available */}
              {/* Replace with actual show.author.role */}
              Author Role
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ShowCard;
