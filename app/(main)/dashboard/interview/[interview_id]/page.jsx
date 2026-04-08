"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import {
    Clock, Calendar, Briefcase, Users, LayoutList,
    ChevronRight, ArrowLeft, Edit3, Plus, Search,
    Filter, MoreHorizontal, Video, Mail, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function InterviewDetails() {
    const { interview_id } = useParams();
    const router = useRouter();
    const [interviewData, setInterviewData] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (interview_id) {
            fetchData();
        }
    }, [interview_id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Interview Details
            const { data: interview, error: intError } = await supabase
                .from("Interviews")
                .select("*")
                .eq("interview_id", interview_id)
                .single();

            if (intError) throw intError;
            setInterviewData(interview);

            // 2. Fetch Candidates (via API Proxy to bypass Ad-blockers/CORS)
            const res = await fetch(`/api/fetch-feedback?interview_id=${interview_id}`);
            const feedbackList = await res.json();

            if (feedbackList.error) throw new Error(feedbackList.error);
            setCandidates(feedbackList || []);

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load interview details");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getInterviewType = (type) => {
        try {
            // Handle if it's a string looking like an array e.g. '["Technical"]'
            let parsedType = type;
            if (typeof type === 'string' && type.startsWith('[') && type.endsWith(']')) {
                parsedType = JSON.parse(type);
            }

            if (Array.isArray(parsedType)) {
                return parsedType.length > 2 ? `${parsedType.slice(0, 2).join(", ")}...` : parsedType.join(", ");
            }
            return parsedType || "Technical";
        } catch (e) {
            return type || "Technical";
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="h-6 w-6 bg-blue-200 rounded-full animate-bounce" />
                    </div>
                    <p className="text-gray-400 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-5 md:px-10 pb-20">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-white border-transparent hover:border-gray-100 border transition-all"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
                            {interviewData?.jobPosition}
                            <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-extrabold rounded-full uppercase tracking-widest mt-1">
                                Active
                            </span>
                        </h1>
                        <p className="text-gray-400 font-medium flex items-center gap-2 mt-1">
                            <Briefcase className="h-4 w-4" /> Google Inc.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white border-gray-100 rounded-xl shadow-sm text-gray-600 font-bold gap-2">
                        <Edit3 className="h-4 w-4" /> Edit
                    </Button>
                    <Button className="bg-gray-900 hover:bg-black rounded-xl shadow-lg px-6 font-bold gap-2">
                        <Plus className="h-4 w-4" /> Add Candidate
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatItem icon={Clock} label="DURATION" value={`${interviewData?.duration || 0}`} iconColor="text-orange-500" bgColor="bg-orange-50" />
                <StatItem icon={Calendar} label="CREATED ON" value={formatDate(interviewData?.created_at)} iconColor="text-purple-500" bgColor="bg-purple-50" />
                <StatItem icon={LayoutList} label="TYPE" value={getInterviewType(interviewData?.type)} iconColor="text-blue-500" bgColor="bg-blue-50" />
                <StatItem icon={Users} label="CANDIDATES" value={`${candidates.length} Total`} iconColor="text-green-500" bgColor="bg-green-50" />
            </div>

            {/* Main Content Sections */}
            <div className="space-y-8">
                {/* Job Description */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Job Description</h2>
                    <p className="text-gray-500 leading-relaxed font-medium">
                        {interviewData?.jobDescription || "No description provided."}
                    </p>
                </div>

                {/* Questions Section */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-800">Interview Questions</h2>
                        <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-full">
                            {interviewData?.questionList?.length || 0} Questions
                        </span>
                    </div>

                    <div className="space-y-4">
                        {interviewData?.questionList?.map((q, idx) => (
                            <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                                <div className="flex gap-4">
                                    <span className="h-8 w-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <p className="text-gray-700 font-bold leading-relaxed mb-4">{q.question}</p>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] text-gray-400 font-bold">
                                                {q.type || "Technical"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full py-6 border-dashed border-gray-200 text-gray-400 font-bold gap-2 hover:bg-gray-50 rounded-2xl mt-4">
                            <Plus className="h-4 w-4" /> Add Another Question
                        </Button>
                    </div>
                    {/* Subtle red dot ornament from design */}
                    <div className="absolute bottom-6 right-6 h-2 w-2 bg-red-500 rounded-full" />
                </div>

                {/* Candidates Table Component */}
                <CandidatesTable candidates={candidates} interview_id={interview_id} />
            </div>
        </div>
    );
}

function StatItem({ icon: Icon, label, value, iconColor, bgColor }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
            <div className={`h-12 w-12 ${bgColor} flex items-center justify-center rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</h3>
            <p className="text-lg font-extrabold text-gray-800">{value}</p>
        </div>
    );
}

function CandidatesTable({ candidates, interview_id }) {
    const router = useRouter();

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-800">Candidates</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Filter candidates..."
                            className="pl-9 pr-4 py-2 bg-gray-50/50 border-none rounded-xl text-sm outline-none w-64"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 h-10 w-10">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-50">
                            <th className="pb-4">CANDIDATE NAME</th>
                            <th className="pb-4">STATUS</th>
                            <th className="pb-4">SCHEDULED DATE</th>
                            <th className="pb-4">SCORE</th>
                            <th className="pb-4 text-right">ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {candidates.map((cand) => (
                            <tr key={cand.id} className="group hover:bg-gray-50/30 transition-colors">
                                <td className="py-6">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${cand.userName}&backgroundColor=b6e3f4,c0aede,d1d4f9`} alt="" className="h-10 w-10 rounded-xl bg-blue-50 border-2 border-white shadow-sm" />
                                        <div>
                                            <p className="font-extrabold text-gray-700 leading-none mb-1">{cand.userName}</p>
                                            <p className="text-xs text-gray-400 font-medium">{cand.userEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6">
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase w-fit">
                                        <CheckCircle2 className="h-3 w-3" /> Completed
                                    </span>
                                </td>
                                <td className="py-6">
                                    <div className="text-xs font-bold text-gray-500">
                                        {new Date(cand.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        <p className="text-gray-300 font-medium mt-0.5">{new Date(cand.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </td>
                                <td className="py-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-extrabold text-gray-800">
                                            {cand.feedback?.feedback?.rating?.techicalSkills || 0} <span className="text-gray-300 font-medium text-[10px]">/ 10</span>
                                        </span>
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${(cand.feedback?.feedback?.rating?.techicalSkills || 0) * 10}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 text-right">
                                    <Button
                                        variant="link"
                                        className="text-blue-600 font-bold gap-1 group/btn p-0"
                                        onClick={() => router.push(`/dashboard/interview/${interview_id}/feedback/${cand.id}`)}
                                    >
                                        View Report <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {candidates.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-10 text-center text-gray-400 font-medium italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="h-8 w-8 text-gray-200" />
                                        No candidates have attended yet.
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                <Button variant="ghost" className="text-gray-400 font-bold hover:bg-gray-50 px-8">
                    View All Candidates
                </Button>
            </div>
        </div>
    );
}

export default InterviewDetails;
