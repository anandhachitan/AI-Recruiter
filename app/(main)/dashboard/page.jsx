"use client";
import React from "react";
import { useUser } from "@/app/provider";
import { useViewMode } from "@/app/(main)/provider";
import RecruiterDashboard from "./_components/RecruiterDashboard";
import CandidateDashboard from "./_components/CandidateDashboard";
import AdminDashboard from "./_components/AdminDashboard";

function Dashboard() {
  const { user } = useUser();
  const { viewMode } = useViewMode();

  if (!user) return <div className="p-10 flex justify-center text-gray-400 font-bold">Loading dashboard...</div>;

  // Candidate user — restricted dashboard only
  if (!user.isRecruiter && !user.isAdmin) {
    return (
      <div className="w-full px-5 md:px-10 pb-20 pt-8 md:pt-14">
        <CandidateDashboard />
      </div>
    );
  }

  // Admin+Recruiter or Admin-only: respect viewMode toggle
  // Default is "recruiter" so Admin+Recruiter users always land on Recruiter view
  if (viewMode === "admin" && user.isAdmin) {
    return (
      <div className="w-full px-5 md:px-10 pb-20 pt-8 md:pt-14">
        <AdminDashboard />
      </div>
    );
  }

  // Recruiter view (default for Admin+Recruiter and Recruiter-only users)
  return (
    <div className="w-full px-5 md:px-10 pb-20 pt-8 md:pt-14">
      <RecruiterDashboard />
    </div>
  );
}

export default Dashboard;
