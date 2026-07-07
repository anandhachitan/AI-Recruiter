"use client"
import React from "react";
import WelcomeContainer from "./WelcomeContainer";
import ActionCards from "./ActionCards";
import LatestInterviewsList from "./LatestInterviewsList";
import StatsCard from "./StatsCard";
import UpcomingInterviews from "./UpcomingInterviews";

function RecruiterDashboard() {
  return (
    <>
      <WelcomeContainer />
      <ActionCards />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
        <StatsCard title="Total Candidates" value="1,248" trend="+12%" trendType="up" />
        <StatsCard title="Active Interviews" value="34" badgeText="Active" />
        <StatsCard title="Completion Rate" value="89%" trend="+4%" trendType="up" />
        <StatsCard title="Avg. Score" value="8.2" badgeText="/ 10" />
      </div>
      <LatestInterviewsList />
      <UpcomingInterviews />
    </>
  );
}

export default RecruiterDashboard;
