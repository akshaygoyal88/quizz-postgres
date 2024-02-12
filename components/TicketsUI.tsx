"use client";
import React, { useEffect, useState } from "react";
import Pagination from "./Shared/Pagination";
import TicketCard from "./Shared/TicketCard";
import { useRouter } from "next/navigation";

interface UserDetails {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  mobile_number: string | null;
  address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  profile_pic: string | null;
  isProfileComplete: boolean;
}

export default function TicketsUI() {
  const [ticketsList, setTicketsList] = useState([]);

  const [userDetails, setUserDetails] = useState<UserDetails | undefined>();
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(0);
  const router = useRouter();

  const profileCompleted = async () => {
    const res = await fetch("/api/getProfileCompleted/");
    const isProfileCompleted = await res.json();
    if (!isProfileCompleted) {
      router.push("/profile");
    }
  };

  const paginate = (pageNumber: React.SetStateAction<number>) => {
    if (Number(pageNumber) > 0 && Number(pageNumber) <= totalpage) {
      setPage(pageNumber);
    }
  };

  const getUserData = async () => {
    try {
      const res = await fetch("/api/user/", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setUserDetails({ ...data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    profileCompleted();
    getUserData();
  }, []);

  const getShowsList = async () => {
    try {
      if (userDetails) {
        const userId = userDetails.id;
        const res = await fetch(
          `/api/ticket?userId=${userId}&page=${page}&pageSize=9`
        );

        if (res.ok) {
          const data = await res.json();
          console.log("showdata=>>>>>", data);

          setTicketsList(data.showInformation || []);
          setTotalPage(data.totalPages);
        } else {
          console.error("Failed to fetch shows. Status:", res.status);
        }
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
    }
  };

  useEffect(() => {
    getShowsList();
  }, [userDetails, page]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">Tickets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {ticketsList.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
      <Pagination page={page} totalpage={totalpage} paginate={paginate} />
    </div>
  );
}
