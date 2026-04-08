"use client"
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import InterviewCard from "../dashboard/_components/InterviewCard";
import { useRouter } from "next/navigation";

function AllInterviewPage() {
  const [interviewList, setInterviewList] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.isRecruiter && !user.isAdmin) {
      router.replace("/dashboard");
    } else if (user?.email) {
      GetInterviewList();
    }
  }, [user, router]);

  const GetInterviewList = async () => {
    let { data: Interviews, error } = await supabase
      .from("Interviews")
      .select("*")
      .eq("userEmail", user?.email)
      .order("id", { ascending: false });

    if (Interviews) {
      setInterviewList(Interviews);
    }
  };

  return (
    <div className="w-full px-5 md:px-10 pb-20 pt-8 md:pt-14">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-extrabold text-3xl text-gray-800 tracking-tight">All Interviews</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Browse and manage all your created interviews across all statuses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white border-gray-100 font-bold text-gray-500 gap-2 px-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" /></svg>
            Filter
          </Button>
          <Button onClick={() => router.push('/dashboard')} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 px-4 shadow-sm">
            <Plus className="h-4 w-4" />
            New Interview
          </Button>
        </div>
      </div>

      {interviewList?.length === 0 ? (
        <div className="p-10 flex flex-col gap-3 items-center mt-8 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
            <Plus className="h-8 w-8" />
          </div>
          <h2 className="text-gray-800 font-bold text-lg">No Interviews Found</h2>
          <p className="text-gray-400 text-sm">Start a new Interview process from your dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8 mt-8">
          {interviewList.map((interview, index) => (
            <InterviewCard
              interview={interview}
              key={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllInterviewPage;
