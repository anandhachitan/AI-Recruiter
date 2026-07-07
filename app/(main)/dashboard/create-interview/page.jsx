"use client";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, LayoutList, PenTool, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import FormContainer from "./_components/FormContainer";
import { useUser } from "@/app/provider";
import QuestionList from "./_components/QuestionList";
import { toast } from "sonner";
import InterviewLink from "./_components/InterviewLink";
import { Button } from "@/components/ui/button";

function CreateInterviewPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobPosition: "",
    jobDescription: "",
    duration: "",
    difficulty: "Intermediate",
    type: []
  });
  const [interviewId, setInterviewId] = useState();
  const { user } = useUser();

  useEffect(() => {
    if (user && !user.isRecruiter && !user.isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onGoToNext = () => {
    if (
      !formData?.jobPosition ||
      !formData?.jobDescription ||
      !formData?.duration ||
      formData?.type.length === 0
    ) {
      toast.error("Please fill in all the details to proceed! ✍️");
      return;
    }
    setStep(2);
  };

  const onCreateLink = (id) => {
    setInterviewId(id);
    setStep(3);
  };

  const steps = [
    { id: 1, label: "Details", icon: FileText },
    { id: 2, label: "Questions Generated", icon: Sparkles },
    { id: 3, label: "Finalize", icon: CheckCircle2 }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-5 md:px-10 pb-20 pt-10 font-sans">
      {/* Step Indicator Header */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 mb-10 overflow-hidden relative">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Creation Progress</span>
            <h3 className="text-xl font-black text-gray-800">Setup Your Campaign</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-600">{Math.round((step / steps.length) * 100)}%</span>
          </div>
        </div>

        <div className="relative h-2 w-full bg-gray-50 rounded-full mb-8">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex justify-between relative z-10">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex flex-col items-center gap-2 group">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500
                     ${step >= s.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-gray-100 text-gray-300'}
                  `}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block
                     ${step >= s.id ? 'text-gray-800' : 'text-gray-300'}
                  `}>{s.label}</span>
            </div>
          ))}
        </div>
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 bg-blue-50 rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="flex items-center gap-6 mb-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="h-12 w-12 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-blue-600 transition-all"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {step === 1 ? "Interview Details" : step === 2 ? "Generated Questions" : "Campaign Finalized"}
          </h2>
          <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-wider">
            {step === 1 ? "Define the core parameters for AI generation" : step === 2 ? "Review and customize your AI-crafted questions" : "Your interview is ready to be shared"}
          </p>
        </div>
      </div>

      <div className="transition-all duration-500 transform ease-in-out">
        {step === 1 ? (
          <FormContainer
            formData={formData}
            onHandleInputChange={onHandleInputChange}
            GoToNext={onGoToNext}
          />
        ) : step === 2 ? (
          <QuestionList
            formData={formData}
            onCreateLink={(id) => onCreateLink(id)}
          />
        ) : step === 3 ? (
          <InterviewLink interview_id={interviewId} formData={formData} />
        ) : null}
      </div>
    </div>
  );
}

export default CreateInterviewPage;
