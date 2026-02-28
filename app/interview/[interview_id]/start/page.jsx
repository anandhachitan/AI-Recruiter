"use client";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Mic, Phone, Timer, Play, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Vapi from "@vapi-ai/web";
import axios from "axios";
import AlertConfirmation from "./_components/AlertConfirmation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const vapiRef = useRef(null);
  const [callStatus, setCallStatus] = useState("idle"); // idle, connecting, active, error
  const [debugInfo, setDebugInfo] = useState("");
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [timer, setTimer] = useState(0);
  const { interviewId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    console.log("Vapi Initializing...");
    console.log("Cross-Origin Isolated:", window.crossOriginIsolated);

    if (!vapiRef.current && publicKey) {
      vapiRef.current = new Vapi(publicKey);

      vapiRef.current.on("call-start", () => {
        console.log("Vapi call started");
        setCallStatus("active");
        setDebugInfo("");
        toast("Call connected");
      });

      vapiRef.current.on("call-end", () => {
        console.log("Vapi call ended");
        setCallStatus("idle");
        toast("Interview Ended");
        GenrateFeedBack();
      });

      vapiRef.current.on("error", (error) => {
        const errorStr = JSON.stringify(error, null, 2);
        console.error("Vapi deep error details:", errorStr);
        setCallStatus("error");
        setDebugInfo(errorStr);
      });

      vapiRef.current.on("speech-start", () => {
        console.log("Assistant started speaking");
        setActiveUser(false);
      });

      vapiRef.current.on("speech-end", () => {
        console.log("Assistant speech has ended");
        setActiveUser(true);
      });

      vapiRef.current.on("message", (message) => {
        console.log("Vapi Message:", message);
        if (message?.type === "conversation-update" || message?.conversation) {
          setConversation(message?.conversation || []);
        }
      });
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (callStatus === "active") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (callStatus === "idle") {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const assistantOptions = useMemo(() => {
    if (!interviewInfo) return null;

    let questionList = "";
    if (interviewInfo.interviewData?.questionList) {
      questionList = interviewInfo.interviewData.questionList
        .map(q => q?.question || q)
        .join(", ");
    }

    return {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        interviewInfo?.userName +
        ", how are you? Ready for your interview on " +
        interviewInfo?.interviewData?.jobPosition,
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
  You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let’s get started with a few questions!"
Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That’s a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✅ Be friendly, engaging, and witty 🎤
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate’s confidence level
✅ Ensure the interview remains focused on React
`.trim(),
          },
        ],
      },
      silenceTimeoutSeconds: 60,
      backgroundDenoisingEnabled: false,
      maxDurationSeconds: 1800,
    };
  }, [interviewInfo]);


  const GenrateFeedBack = async () => {
    try {
      if (!conversation || conversation.length === 0) {
        console.warn("No conversation to generate feedback from.");
        router.replace(`/interview/${interviewId}/completed`);
        return;
      }

      console.log("Gathering feedback for conversation:", conversation);
      const result = await axios.post('/api/ai-feedback', {
        conversation: conversation
      });

      console.log("Feedback result:", result?.data);
      const content = result.data.content;
      const finalContent = content.replace('```json', '').replace('```', '');
      console.log("Processed feedback:", finalContent);

      const feedbackData = JSON.parse(finalContent);

      // Save to Supabase
      const { data, error } = await supabase
        .from('interview-feedback')
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interviewId: interviewId,
            feedback: feedbackData,
            recommended: false,
          }
        ])
        .select();

      if (error) throw error;
      console.log("Supabase save success:", data);

      // Redirect to completed page
      router.replace(`/interview/${interviewId}/completed`);
    } catch (err) {
      console.error("Error in GenrateFeedBack:", err);
      toast.error("Failed to generate feedback");
      // Still redirect so the user isn't stuck
      router.replace(`/interview/${interviewId}/completed`);
    }
  };

  const startCall = () => {
    if (!assistantOptions || !vapiRef.current) {
      console.error("Missing assistant options or vapi instance");
      return;
    }
    setCallStatus("connecting");
    setDebugInfo("");
    try {
      vapiRef.current.start(assistantOptions);
    } catch (err) {
      console.error("Vapi start exception:", err);
      setCallStatus("error");
      setDebugInfo(err.message);
    }
  };

  const stopInterview = () => {
    vapiRef.current?.stop();
  };

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          {formatTime(timer)}
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center ">
          <div className="relative">
            {callStatus === "active" && !activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-200 animate-ping" />
            )}
            <Image
              src={"/interview.jpg"}
              alt="ai"
              width={100}
              height={100}
              className="w-[60px] h-[60px] rounded-full object-cover relative z-10"
            />
          </div>
          <h2 className="font-semibold text-gray-700">AI Recruiter</h2>
        </div>
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center ">
          <div className="relative">
            {callStatus === "active" && activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-200 animate-ping" />
            )}
            <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-5 relative z-10">
              {interviewInfo?.userName?.[0] || "?"}
            </h2>
          </div>
          <h2 className="font-semibold text-gray-700">{interviewInfo?.userName}</h2>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5 justify-center mt-7">
        {callStatus === "idle" || callStatus === "error" ? (
          <Button
            size="lg"
            className="rounded-full px-10 gap-2 font-bold shadow-lg transition-transform active:scale-95"
            onClick={startCall}
          >
            <Play className="fill-current w-5 h-5" />
            {callStatus === "error" ? "Try Reconnecting" : "Start Interview"}
          </Button>
        ) : (
          <div className="flex items-center gap-5 scale-110 transition-all">
            <div className={`p-4 rounded-full bg-gray-100 ${callStatus === "active" ? "animate-pulse ring-4 ring-primary/20" : ""}`}>
              <Mic className={`h-8 w-8 text-gray-600`} />
            </div>
            <AlertConfirmation stopInterview={() => stopInterview()}>
              <div className="p-4 rounded-full bg-red-100 hover:bg-red-200 cursor-pointer transition-colors">
                <Phone className="h-8 w-8 text-red-600" />
              </div>
            </AlertConfirmation>
          </div>
        )}

        {callStatus === "connecting" && (
          <div className="flex items-center gap-2 text-primary font-bold animate-bounce">
            <Loader2 className="animate-spin w-5 h-5" />
            Initializing AI Session...
          </div>
        )}

        {callStatus === "active" && (
          <h2 className="text-sm font-medium text-green-600 flex items-center gap-2">
            {!activeUser && (
              <span className="w-2 h-2 rounded-full bg-green-600 animate-ping" />
            )}
            Connected & Listening
          </h2>
        )}

        {callStatus === "error" && (
          <div className="max-w-md bg-red-50 border border-red-200 p-4 rounded-lg flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-red-700 font-bold">
              <AlertCircle className="w-5 h-5" />
              Connection Failed
            </div>
            <p className="text-xs text-red-600 text-center">
              The AI was ejected from the meeting. This usually happens due to network restrictions or a microphone configuration error.
            </p>
            {debugInfo && (
              <pre className="text-[10px] bg-white p-2 rounded border w-full overflow-auto max-h-24 text-gray-500">
                {debugInfo}
              </pre>
            )}
          </div>
        )}
      </div>
      <footer className=" text-white p-1 text-center rounded-lg"></footer>
    </div>
  );
}

export default StartInterview;


//4:23:55
