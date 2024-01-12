import ShowInformation from "@/components/Show/ShowInformation";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession();

  return <ShowInformation session={session} />;
};

export default page;
