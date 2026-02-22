import Image from "next/image";
import React from "react";

function InterviewHeader() {
  return (
    <div className="p-4 shadow-sm">
      <Image
        src={"/logo.png"}
        alt="logo"
        width={200}
        height={100}
        className="w-[140px]"
        loading="eager"
      />
    </div>
  );
}

export default InterviewHeader;
