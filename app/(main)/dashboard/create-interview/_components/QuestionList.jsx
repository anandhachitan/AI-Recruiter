import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Loader2Icon, Sparkles, Wand2, ArrowRight, CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import QuestionListContainer from "./QuestionListContainer";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState();
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });
      const Content = result.data.content;
      const FINAL_CONTENT = Content.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      setQuestionList(JSON.parse(FINAL_CONTENT)?.interviewQuestions);
      setLoading(false);
    } catch (e) {
      toast.error("AI Generation failed. Please try again! 🤖❌");
      setLoading(false);
    }
  };

  const onFinish = async () => {
    if (!user?.email) {
      toast.error("You must be logged in to create an interview! 👤❌");
      return;
    }
    setSaveLoading(true);
    const interview_id = uuidv4();
    try {
      // Sanitize data: Remove fields not in DB schema (like difficulty)
      // Also stringify 'type' array just in case the DB column is type 'text'
      const { difficulty, type, ...dbData } = formData;

      const { data, error } = await supabase
        .from("Interviews")
        .insert([
          {
            ...dbData,
            type: JSON.stringify(type),
            questionList: questionList,
            userEmail: user?.email,
            interview_id: interview_id,
          },
        ])
        .select();

      if (error) throw error;

      toast.success("Interview Campaign Created successfully! 🚀🏁");
      onCreateLink(interview_id);
    } catch (error) {
      toast.error("Failed to save interview. Please try again! 💾❌");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden mb-10 min-h-[400px]">
      <div className="p-8 md:p-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                <Wand2 className="h-10 w-10 text-blue-600 animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-50 animate-spin-slow">
                <Sparkles className="h-4 w-4 text-orange-400" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">AI is Crafting Your Interview</h2>
            <p className="text-gray-400 font-bold text-sm max-w-md mx-auto leading-relaxed">
              Analyzing the <span className="text-blue-600 font-black">{formData?.jobPosition}</span> role and generating targeted questions based on the description...
            </p>

            <div className="mt-10 flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 w-8 rounded-full bg-blue-100 animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="transition-all duration-700 ease-in-out">
            {questionList?.length > 0 && (
              <QuestionListContainer questionList={questionList} />
            )}
          </div>
        )}
      </div>

      {!loading && (
        <div className="p-8 md:px-12 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
              AI Generation Complete <br />
              <span className="text-gray-300 font-bold normal-case lowercase italic">Ready for final review</span>
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              onClick={onFinish}
              disabled={saveLoading}
              className="w-full sm:w-auto px-10 py-7 rounded-2xl bg-gray-900 hover:bg-black font-black shadow-xl shadow-gray-100 flex gap-3 transition-all active:scale-95 group"
            >
              {saveLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              Create Interview Link & Finish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;
