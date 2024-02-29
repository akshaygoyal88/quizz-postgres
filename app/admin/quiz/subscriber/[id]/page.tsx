import LeftSideBar from "@/components/Layout/LeftSidebar";
import SubscribersList from "@/components/QuizApp/AdminPanel/SubscribersList";
import React from "react";

export default function subscriber() {
  return (
    <LeftSideBar>
      <SubscribersList />
    </LeftSideBar>
  );
}
