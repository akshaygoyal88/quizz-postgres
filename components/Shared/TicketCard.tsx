import Link from "next/link";

const TicketCard = ({ ticket }: { ticket: any }) => {
  const timestamp = new Date().getTime();
  const dynamicLastDigit =
    (ticket.showId.charCodeAt(ticket.showId.length - 1) + timestamp) % 10;
  return (
    <article
      key={ticket.id}
      className="flex flex-col items-start justify-between p-4 m-3 shadow-lg rounded-lg"
    >
      <h2 className="text-xl font-bold mb-4">{ticket.ticketGroup}</h2>

      <div className="max-w-xl">
        {ticket.ticketGroup && (
          <img
            src={`https://picsum.photos/id/800/400?${dynamicLastDigit}`}
            alt=""
            className="w-full h-32 object-cover rounded-t-lg"
          />
        )}

        <div className="mt-8 flex items-center gap-x-4 text-xs">
          <span className="text-gray-500">Quantity: {ticket.quantity}</span>
          <span className="text-gray-500">
            Price: ${ticket.price.toFixed(2)}
          </span>

          {ticket.ticketGroup && (
            <Link
              href=""
              className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
            >
              {ticket.ticketGroup}
            </Link>
          )}
        </div>
        <div className="group relative mt-4">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <Link href="">
              <span className="absolute inset-0" />
              {ticket.description}
            </Link>
          </h3>
        </div>

        <div className="relative mt-8 flex items-center gap-x-4">
          <div className="text-sm leading-6">
            <p className="font-semibold text-gray-900">
              <Link href="" className="flex items-center">
                <img
                  src={`https://picsum.photos/seed/${ticket.description}/200/200?${dynamicLastDigit}`}
                  alt=""
                  className="h-10 w-10 rounded-full bg-gray-100 object-cover"
                />
                <span className="ml-3">Creator Name</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TicketCard;
