"use client";
import React, { useState } from "react";
import Interviewheader from "./_component/InterviewHeader";
import { InterviewDataContext } from "@/context/InterviewDataContext";

function InterviewLayout({ children }) {
  const [interviewInfo, setInterviewInfo] = useState();
  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      <div className="bg-secondary">
        <Interviewheader />
        {children}
      </div>
    </InterviewDataContext.Provider>
  );
}

export default InterviewLayout;
