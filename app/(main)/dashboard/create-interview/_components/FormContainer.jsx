import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/services/Constants";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Clock,
  BarChart,
  Sparkles,
  Type,
  LayoutList,
  RotateCcw,
  HelpCircle,
  PenTool
} from "lucide-react";

function FormContainer({ formData, onHandleInputChange, GoToNext }) {

  const AddInterviewType = (type) => {
    const currentTypes = formData?.type || [];
    if (!currentTypes.includes(type)) {
      onHandleInputChange("type", [...currentTypes, type]);
    } else {
      onHandleInputChange("type", currentTypes.filter((item) => item !== type));
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden mb-10">
      <div className="p-8 md:p-12">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <PenTool className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Campaign Details</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-300">
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-300">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Job Position */}
          <div className="col-span-2 space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Job Position <span className="text-red-500">*</span></label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <Input
                placeholder="e.g. Full Stack Developer"
                className="pl-14 pr-6 py-7 border-2 border-gray-50 bg-gray-50/30 rounded-2xl focus:border-blue-600 focus:bg-white transition-all text-gray-700 font-bold"
                value={formData?.jobPosition}
                onChange={(event) =>
                  onHandleInputChange("jobPosition", event.target.value)
                }
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="col-span-2 space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Job Description</label>
            <div className="relative group">
              <Textarea
                placeholder="Paste the job description here. AI will use this to tailor questions specifically to the role."
                className="p-6 h-[180px] border-2 border-gray-50 bg-gray-50/30 rounded-3xl focus:border-blue-600 focus:bg-white transition-all text-gray-600 font-medium leading-relaxed resize-none"
                value={formData?.jobDescription}
                onChange={(event) =>
                  onHandleInputChange("jobDescription", event.target.value)
                }
              />
              <div className="absolute right-4 bottom-4 text-blue-600/30">
                <Type className="h-8 w-8" />
              </div>
            </div>
            <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1.5 pl-1 italic">
              <Sparkles className="h-3 w-3" /> AI will use this to tailor questions specifically to the role.
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Interview Duration</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 z-10 transition-colors group-hover:text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
              <Select
                value={formData?.duration}
                onValueChange={(value) => onHandleInputChange("duration", value)}
              >
                <SelectTrigger className="pl-14 pr-6 py-7 border-2 border-gray-50 bg-gray-50/30 rounded-2xl focus:ring-0 focus:ring-offset-0 focus:border-blue-600 focus:bg-white transition-all text-gray-700 font-bold">
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl p-2">
                  <SelectItem value="5 Mins" className="rounded-xl font-bold py-3">5 Minutes</SelectItem>
                  <SelectItem value="15 Mins" className="rounded-xl font-bold py-3">15 Minutes</SelectItem>
                  <SelectItem value="30 Mins" className="rounded-xl font-bold py-3">30 Minutes</SelectItem>
                  <SelectItem value="45 Mins" className="rounded-xl font-bold py-3">45 Minutes</SelectItem>
                  <SelectItem value="60 Mins" className="rounded-xl font-bold py-3">60 Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Difficulty Level</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 z-10 transition-colors group-hover:text-blue-600">
                <BarChart className="h-5 w-5" />
              </div>
              <Select
                value={formData?.difficulty}
                onValueChange={(value) => onHandleInputChange("difficulty", value)}
              >
                <SelectTrigger className="pl-14 pr-6 py-7 border-2 border-gray-50 bg-gray-50/30 rounded-2xl focus:ring-0 focus:ring-offset-0 focus:border-blue-600 focus:bg-white transition-all text-gray-700 font-bold">
                  <SelectValue placeholder="Intermediate" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl p-2">
                  <SelectItem value="Beginner" className="rounded-xl font-bold py-3">Beginner</SelectItem>
                  <SelectItem value="Intermediate" className="rounded-xl font-bold py-3">Intermediate</SelectItem>
                  <SelectItem value="Expert" className="rounded-xl font-bold py-3">Expert</SelectItem>
                  <SelectItem value="Senior" className="rounded-xl font-bold py-3">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interview Type Cards */}
          <div className="col-span-2 pt-4">
            <div className="flex items-center gap-2 mb-6">
              <LayoutList className="h-4 w-4 text-blue-600" />
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interview Type <span className="text-gray-300 font-medium normal-case">(Select all that apply)</span></label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {InterviewType.map((type, index) => {
                const isActive = formData?.type?.includes(type.title);
                return (
                  <div
                    key={index}
                    className={`relative flex flex-col items-center justify-center p-6 cursor-pointer border-2 transition-all duration-300 rounded-[2rem]
                        ${isActive
                        ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100 scale-[1.02]"
                        : "border-gray-50 bg-white hover:border-blue-100 hover:bg-gray-50/30"}`}
                    onClick={() => AddInterviewType(type.title)}
                  >
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-colors
                         ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}
                      `}>
                      <type.icon className="h-6 w-6" />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-tight
                         ${isActive ? 'text-blue-600' : 'text-gray-400'}
                      `}>{type.title}</span>

                    {isActive && (
                      <div className="absolute top-3 right-3 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <Sparkles className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-8 md:px-12 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
        <Button variant="ghost" className="text-sm font-black text-gray-400 hover:text-gray-800 uppercase tracking-widest pl-0">
          Save as Draft
        </Button>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none px-10 py-6 rounded-2xl font-black text-gray-400 border-gray-100 shadow-sm">
            Cancel
          </Button>
          <Button
            onClick={GoToNext}
            className="flex-1 sm:flex-none px-10 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black shadow-xl shadow-blue-100 flex gap-3 transition-all active:scale-95"
          >
            <Sparkles className="h-5 w-5" /> Generate Question
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormContainer;
