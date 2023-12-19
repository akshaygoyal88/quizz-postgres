"use client";

import React, { useEffect, useState } from "react";

import TagInput from "../Shared/TagInputs";
import TableComponent from "./TableComponent";
import { PrismaClient } from "@prisma/client";

const TicketClassification = ({ fetchedShowData }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  // const [fetchedShowData, setFetchedShowData] = useState<[]>();
  const [tags, setTags] = useState<string[]>([]);

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedShowId = e.target.value;
    setSelectedOption(selectedShowId);
  };

  const handleSubmit = () => {};

  const handleSave = () => {console.log("save button clicked");};
  const handleEdit = () => {console.log("Edit button clicked");};
  const handleRemove = () => {console.log("Remove button clicked");};



  return (
    <div className="w-full mx-auto mt-8 max-w-xl rounded bg-white p-6 shadow-lg">
      <div className="m-2">
        {/* Dropdown */}
        <h1 className="my-2 ml-28">Select Show</h1>
        <div className="mb-4 flex items-center">
          <select
            value={selectedOption}
            onChange={handleDropdownChange}
            className="w-1/2 ml-28 rounded border bg-slate-200 px-4 py-1 text-lg transition duration-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a show</option>
            {fetchedShowData &&
              fetchedShowData.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.showName}
                </option>
              ))}
          </select>
        </div>

        {/* Add Ticket Groups Tag component */}
        <div className=" ml-28">
          <h1 className="my-3 ">Add Ticket Groups</h1>
          <TagInput tags={tags} setTags={setTags} c />
        </div>
      </div>
      <div >
        <TableComponent selectedShowId={selectedOption} onSave={handleSave} onRemove={handleRemove} onEdit={handleEdit} tags={tags} />
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="ml-48 rounded bg-blue-500 px-10 py-2 text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};


// // export async function getStaticProps() {
// //   const userId="clq511pdy0000op42iuzmwsej"

// //   const prisma = new PrismaClient()
// //   const fetchedShowData = await prisma.show.findMany(
// //       {
// //         where: {
// //           createdBy: {
// //             id: userId,
// //           },
// //         },
// //       }
// //   )

// //   console.log(fetchedShowData,"fetchedShowData")
// //   return {
// //     props : { fetchedShowData }
// //   }
// // }


// export const getServerSideProps = async ({ req }) => {
//   const userId = "clq511pdy0000op42iuzmwsej";

//   const prisma = new PrismaClient();
//   try {
//     const fetchedShowData = await prisma.show.findMany({
//       where: {
//         createdBy: {
//           id: userId,
//         },
//       },
//     });

//     console.log(fetchedShowData, "fetchedShowData");
//     return { props: { fetchedShowData } };
//   } finally {
//     await prisma.$disconnect();
//   }
// };


export default TicketClassification;
