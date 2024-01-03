import React, { useState, ChangeEvent, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import InputWithLabel from "@/components/Shared/InputWithLabel";
import { useRouter } from "next/navigation";

interface Table {
  ticketGroup: string;
  quantity: string;
  price: string;
  showId: string;
  createdById: string;
}

interface TableComponentProps {
  selectedShowId: string;
  tags: string[];
  userId: string;
}

const TableComponent: React.FC<TableComponentProps> = ({
  selectedShowId,
  tags,
  userId,
}) => {
  const [tablesData, setTablesData] = useState<Table[]>([
    { ticketGroup: "", quantity: "", price: "", showId: "", createdById: "" },
  ]);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }[]>(
    []
  );

  console.log(tablesData, "selected");

  const [userDetails, setUserDetails] = useState();
  const router = useRouter();

  const profileCompleted = async () => {
    const res = await fetch("/api/getProfileCompleted/");
    const isProfileCompleted = await res.json();
    if (!isProfileCompleted) {
      router.push("/profile");
    }
  };
  useEffect(() => {
    profileCompleted();
  }, []);

  const handleRemove = (tableIndex: number) => {
    setTablesData((prevData) => {
      const newData = [...prevData];
      newData.splice(tableIndex, 1);
      return newData;
    });

    setFieldErrors((prevErrors) => {
      const newErrors = prevErrors.filter(
        (error) => error.index !== tableIndex
      );
      return newErrors;
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    tableIndex: number
  ) => {
    const { name, value } = e.target;

    const sanitizedValue =
      name === "ticketGroup" ? value : value.replace(/[^0-9]/g, "");
    setTablesData((prevData) => {
      const newData = [...prevData];
      newData[tableIndex] = {
        ...newData[tableIndex],
        [name]: sanitizedValue,
        showId: selectedShowId,
        createdById: userId,
      };
      return newData;
    });
    setFieldErrors((prevErrors) => {
      const newErrors = prevErrors
        .filter(
          (error) => !(error.index === tableIndex && error.field === name)
        )
        .concat({ index: tableIndex, field: name, message: "" });

      return newErrors;
    });
  };

  const handleAddTable = () => {
    setTablesData((prevData) => [
      ...prevData,
      { ticketGroup: "", quantity: "", price: "", showId: "", createdById: "" },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tablesData),
      });

      if (response.ok) {
        console.log("Tickets submitted successfully!");
        router.push("/success");
      } else {
        const responseData = await response.json();

        if (responseData.errors) {
          setFieldErrors(responseData.errors);
        } else {
          console.error("Backend error:", responseData.error);
        }
      }
    } catch (error) {
      console.error("Error submitting tickets:", error);
    }
  };

  return (
    <div className="w-full mx-auto mt-8 rounded bg-white p-3 shadow-lg">
      <span className="w-1/4 px-2 py-2">Select Ticket Group: </span>
      <button
        onClick={handleAddTable}
        className="ml-2 mb-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-700"
      >
        Add +
      </button>

      <table className="w-full table-fixed">
        <thead>
          <tr>
            <th className="w-1/4 px-2 py-2">Group</th>
            <th className="w-1/4 px-2 py-2">Quantity</th>
            <th className="w-1/4 px-2 py-2">Price</th>
            <th className="w-1/4 px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tablesData.map((table, index) => (
            <tr key={index}>
              <td className="border py-2">
                <div className=" px-1 py-2 mb-4 mt-2">
                  <select
                    name="ticketGroup"
                    value={table.ticketGroup}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full rounded border px-1 py-1 text-sm transition duration-300 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Ticket Group</option>
                    {tags &&
                      tags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                  </select>
                </div>
              </td>
              <td className="border py-2">
                <InputWithLabel
                  id="quantity"
                  name="quantity"
                  type="text"
                  value={table.quantity}
                  onChange={(e) => handleChange(e, index)}
                  inputMode="numeric"
                  className="w-full rounded border px-1 py-1 text-lg transition duration-300 focus:border-blue-500 focus:outline-none"
                />
                {fieldErrors.map(
                  (error, errorIndex) =>
                    error.index === index &&
                    error.field === "quantity" && (
                      <p key={errorIndex} className="text-red-500 text-sm">
                        {error.message}
                      </p>
                    )
                )}
              </td>

              <td className="border py-2 items-center">
                <InputWithLabel
                  id="price"
                  type="text"
                  name="price"
                  value={table.price}
                  onChange={(e) => handleChange(e, index)}
                  className="h-10 w-full rounded-lg border px-2 text-gray-700"
                  inputMode="numeric"
                />
                {fieldErrors.map(
                  (error, errorIndex) =>
                    error.index === index &&
                    error.field === "price" && (
                      <p key={errorIndex} className="text-red-500 text-sm">
                        {error.message}
                      </p>
                    )
                )}
              </td>

              <td className="border px-2 py-2">
                <button
                  onClick={() => handleRemove(index)}
                  className="rounded ml-3 bg-red-500 px-3 m-1 text-white hover:bg-red-700"
                >
                  <RxCross2 className="color-red" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default TableComponent;
