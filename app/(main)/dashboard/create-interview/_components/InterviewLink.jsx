import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  List,
  Mail,
  CheckCircle2,
  Sparkles,
  Share2,
  Plus,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewLink({ interview_id, formData }) {
  const url = typeof window !== 'undefined'
    ? window.location.origin + "/interview/" + interview_id
    : process.env.NEXT_PUBLIC_HOST_URL + "/interview/" + interview_id;

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard! 📋✨");
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto transition-all duration-700 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden w-full relative">
        {/* Success Banner */}
        <div className="bg-blue-600 p-10 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md mb-6 border border-white/30">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Success! Campaign Ready</h2>
            <p className="text-blue-100 font-bold text-sm tracking-wide uppercase opacity-80">Your AI interview is live and ready for candidates</p>
          </div>
          {/* Decorative patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Sparkles className="absolute top-10 left-10 h-20 w-20 text-white" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white rounded-full blur-3xl" />
          </div>
        </div>

        <div className="p-10">
          <div className="space-y-8">
            {/* Link Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-blue-600" />
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shareable Campaign Link</label>
                </div>
                <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Active for 30 Days</span>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <Input
                    defaultValue={url}
                    readOnly
                    className="py-7 pl-6 pr-6 border-2 border-gray-50 bg-gray-50/30 rounded-2xl text-gray-500 font-bold focus:border-blue-100 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <Button
                  onClick={onCopyLink}
                  className="h-14 px-8 rounded-2xl bg-gray-900 hover:bg-black text-white font-black shadow-lg shadow-gray-200 flex gap-2 active:scale-95 transition-all"
                >
                  <Copy className="h-5 w-5" /> Copy
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-50 flex items-center gap-4">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Duration</p>
                  <p className="text-sm font-black text-gray-700">{formData?.duration || '45 Mins'}</p>
                </div>
              </div>
              <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-50 flex items-center gap-4">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-500">
                  <List className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Questions</p>
                  <p className="text-sm font-black text-gray-700">10 Generated</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2 mb-4 pl-1">
                <Mail className="h-4 w-4 text-blue-600" />
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Share</label>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 py-6 rounded-2xl border-gray-100 font-bold text-gray-500 shadow-sm hover:border-blue-100 hover:text-blue-600 transition-all">
                  Email
                </Button>
                <Button variant="outline" className="flex-1 py-6 rounded-2xl border-gray-100 font-bold text-gray-500 shadow-sm hover:border-blue-100 hover:text-blue-600 transition-all">
                  WhatsApp
                </Button>
                <Button variant="outline" className="hidden sm:inline-flex flex-1 py-6 rounded-2xl border-gray-100 font-bold text-gray-500 shadow-sm hover:border-blue-100 hover:text-blue-600 transition-all">
                  Slack
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full gap-4 mt-10">
        <Link href="/dashboard" className="flex-1">
          <Button variant="ghost" className="w-full py-7 rounded-2xl font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest flex gap-2">
            <ArrowLeft className="h-5 w-5" /> Back to Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/create-interview" className="flex-1">
          <Button className="w-full py-7 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black shadow-xl shadow-blue-100 flex gap-2 active:scale-95 transition-all">
            <Plus className="h-5 w-5" /> Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
