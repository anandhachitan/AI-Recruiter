"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { createContext, useContext, useState } from "react";
import { AppSidebar } from "./_components/AppSidebar";

// ViewMode context for switching between "recruiter" and "admin" views
const ViewModeContext = createContext({ viewMode: "recruiter", setViewMode: () => {} });

export const useViewMode = () => useContext(ViewModeContext);

function DashboardProvider({ children }) {
  const [viewMode, setViewMode] = useState("recruiter");

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full bg-gray-100 min-h-screen">
          {children}
        </div>
      </SidebarProvider>
    </ViewModeContext.Provider>
  );
}

export default DashboardProvider;
