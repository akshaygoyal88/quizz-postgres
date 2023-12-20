import Link from "next/link";

const ShowCard = ({ show }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
      <img
        src={`https://source.unsplash.com/random/400x250?${show.id}`}
        alt="Show Image"
        className="w-full h-40 object-cover mb-4 rounded-lg"
      />

      <h2 className="text-xl font-bold mb-2">{show.showName}</h2>
      <p className="text-gray-700 mb-2">Type: {show.showType}</p>

      <Link href={`/show/${show.id}`}>
        <p className="text-indigo-600 hover:underline cursor-pointer">
          View Details
        </p>
      </Link>
    </div>
  );
};

export default ShowCard;
