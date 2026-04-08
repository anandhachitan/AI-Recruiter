import React from "react";
import DashboardProvider from "./provider";
import Provider from "../provider";

function DashboardLayout({ children }) {
  return (
    <Provider>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </Provider>
  );
}

export default DashboardLayout;
