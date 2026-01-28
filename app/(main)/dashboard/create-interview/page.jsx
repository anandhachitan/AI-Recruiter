"use client";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import { toast } from "sonner";

function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onGoToNext = () => {
    if (
      !formData?.jobTitle ||
      !formData?.jobDescription ||
      !formData?.duration ||
      !formData?.type
    ) {
      toast("Please enter all details!");
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="mt-5 px-10 md:px-24 lg:px-44 xl:px-56">
      <div className="flex gap-5 items-center">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
        <h2 className="font-bold text-2xl">Create New Interview</h2>
      </div>
      <Progress value={step * 33.33} className="my-5" />
      {step === 1 ? (
        <FormContainer
          onHandleInputChange={onHandleInputChange}
          GoToNext={onGoToNext}
        />
      ) : step === 2 ? (
        <QuestionList />
      ) : null}
    </div>
  );
}

export default Page;
