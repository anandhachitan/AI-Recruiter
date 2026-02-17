"use client";
import React, { useContext, useEffect, useState } from "react";
import Interviewheader from "../_component/InterviewHeader";
import { Clock, Info, Loader2Icon, Video } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { useRouter } from "next/navigation";

function Interview() {
  const { interview_id } = useParams();

  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState();
  const [loading, setLoading] = useState(false);
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  useEffect(() => {
    interview_id && GetInterviewDetails();
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      let { data: Interviews, error } = await supabase
        .from("Interviews")
        .select("jobPosition, jobDescription, duration, type")
        .eq("interview_id", interview_id);
      setInterviewData(Interviews[0]);
      if (Interviews?.length == 0) {
        toast("Incorrect Interview Link");
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast("Incorrect Interview Link");
    }
  };

  const onJoinInterview = async () => {
    setLoading(true);
    let { data: Interviews, error } = await supabase
      .from("Interviews")
      .select("*")
      .eq("interview_id", interview_id);

    console.log(Interviews[0]);
    setInterviewInfo({ userName: userName, interviewData: Interviews[0] });
    router.push("/interview/" + interview_id + "/start");
    setLoading(false);
  };

  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-64 mt-8">
      <div className="flex flex-col items-center justify-center border rounded-lg bg-white p-7 lg:px-32 xl:px-52 mb-20">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={200}
          height={100}
          className="w-[140px]"
          loading="eager"
        />
        <h2 className="mt-1">AI-Powered Interview Platform</h2>
        <Image
          src={"/interview1.jpg"}
          alt="interviewLogo"
          width={500}
          height={500}
          className="w-[280px] my-6"
        />
        <h2 className="font-bold text-xl">{interviewData?.jobPosition}</h2>
        <h2 className="flex gap-2 items-center text-gray-500 mt-3">
          <Clock />
          {interviewData?.duration}
        </h2>
        <div className="w-full">
          <h2>Enter Your full name</h2>
          <Input
            placeholder="e.g. Anandhachitan"
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>
        <div className="p-3 bg-blue-100 flex gap-4 rounded-lg mt-7">
          <Info className="text-primary" />
          <div>
            <h2>Before you begin</h2>
            <ul>
              <li className="text-sm text-primary">
                Test you camera and microphone
              </li>
              <li className="text-sm text-primary">
                Ensure you have a stable internet connection
              </li>
              <li className="text-sm text-primary">
                Find a Quiet place for interview
              </li>
            </ul>
          </div>
        </div>
        <Button
          className={"mt-5 w-full font-bold"}
          disabled={loading || !userName}
          onClick={() => onJoinInterview()}
        >
          <Video /> {loading && <Loader2Icon />}
          Join Interview
        </Button>
      </div>
      <footer className=" text-white p-1 text-center rounded-lg"></footer>
    </div>
  );
}

export default Interview;

//3:04:00
