import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/services/Constants";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function FormContainer({ onHandleInputChange, GoToNext }) {
  const [interviewType, setInterviewType] = useState([]);

  useEffect(() => {
    if (interviewType) {
      onHandleInputChange("type", interviewType);
    }
  }, [interviewType]);

  const AddInterviewType = (type) => {
    if (!interviewType.includes(type)) {
      setInterviewType((prev) => [...prev, type]);
    } else {
      setInterviewType((prev) => prev.filter((item) => item !== type));
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2"
          onChange={(event) =>
            onHandleInputChange("jobPosition", event.target.value)
          }
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter detail job description"
          className="h-[200px] mt-2"
          onChange={(event) =>
            onHandleInputChange("jobDescription", event.target.value)
          }
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select
          onValueChange={(value) => onHandleInputChange("duration", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Mins">5 Mins</SelectItem>
            <SelectItem value="15 Mins">15 Mins</SelectItem>
            <SelectItem value="30 Mins">30 Mins</SelectItem>
            <SelectItem value="45 Mins">45 Mins</SelectItem>
            <SelectItem value="60 Mins">60 Mins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="flex gap-3 flex-wrap mt-2 ">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex items-center  cursor-pointer gap-2 p-1 px-2 bg-white border border-gray-300 rounded-2xl hover:bg-secondary
                ${interviewType.includes(type.title) && "bg-blue-100 text-primary"}`}
              onClick={() => AddInterviewType(type.title)}
            >
              <type.icon className="h-4 w-4 " />
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-7 flex justify-end" onClick={GoToNext}>
        <Button>
          Genrate Question <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;

// 1:40:00
