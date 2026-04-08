"use client"
import React, { useState } from "react";
import WelcomeContainer from "./WelcomeContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/app/provider";

function CandidateDashboard() {
  const [linkOrId, setLinkOrId] = useState("");
  const router = useRouter();
  const { user } = useUser();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!linkOrId.trim()) return;

    // If it's a full URL, try to extract ID
    let interviewId = linkOrId.trim();
    if (interviewId.includes("/interview/")) {
      const parts = interviewId.split("/interview/");
      interviewId = parts[1].split("/")[0]; // handle trailing paths
    }

    if (interviewId.length < 10) {
      toast.error("Please enter a valid Interview Link or ID!");
      return;
    }

    router.push("/interview/" + interviewId);
  };

  return (
    <>
      <WelcomeContainer />
      
      {/* Join Interview Section */}
      <div className="bg-blue-600 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden mt-8">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-3">Join an Interview</h2>
          <p className="text-blue-100 font-medium mb-8">
            Paste your unique interview link or ID provided by your recruiter to get started. 
            Ensure your camera and microphone are ready!
          </p>

          <form onSubmit={handleJoin} className="flex gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                value={linkOrId}
                onChange={(e) => setLinkOrId(e.target.value)}
                placeholder="e.g. https://domain.com/interview/abc-123 or abc-123" 
                className="pl-12 py-6 border-none ring-0 focus-visible:ring-0 text-gray-800 text-lg font-bold shadow-none"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-xl gap-2 active:scale-95 transition-all text-lg">
              <Video className="h-5 w-5" /> Join
            </Button>
          </form>
        </div>
        
        {/* Background Decor */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Attended Interviews Section */}
      <div className="mt-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">Your Past Interviews</h2>
        </div>
        
        {/* Placeholder for now until DB table structure for candidates is mapped */}
        <div className="p-14 bg-white border border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <Video className="h-8 w-8" />
          </div>
          <h3 className="text-gray-800 font-bold text-lg">No interviews attended yet</h3>
          <p className="text-gray-400 font-medium max-w-sm mt-2">
            Once you join and complete an AI interview, your results and past interview records will appear here.
          </p>
        </div>
      </div>
    </>
  );
}

export default CandidateDashboard;
