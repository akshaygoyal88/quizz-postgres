"use client";

import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import React from "react";

const SubscribersList = ({ quizId }: { quizId: string }) => {
  const {
    data: listOfSubscribers,
    error: listOfSubscribersError,
    isLoading: listOfSubscribersLoading,
  } = useFetch({
    url: `${pathName.subscriptionApiRoute.path}/${quizId}`,
  });
  console.log(listOfSubscribers);
  return <div>{quizId}</div>;
};

export default SubscribersList;
