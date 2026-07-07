"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import {
    ArrowLeft, FileText, Quote, Award,
    MessageSquare, BrainCircuit, Zap,
    Download, Mail, FileUser, ChevronRight,
    ThumbsUp, ThumbsDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function FeedbackReport() {
    const { feedback_id, interview_id } = useParams();
    const router = useRouter();
    const [feedbackData, setFeedbackData] = useState(null);
    const [interviewInfo, setInterviewInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (feedback_id) {
            fetchFeedback();
        }
    }, [feedback_id]);

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/fetch-feedback?feedback_id=${feedback_id}`);
            const feedback = await res.json();
            if (feedback.error) throw new Error(feedback.error);
            setFeedbackData(feedback);

            const { data: interview, error: intError } = await supabase
                .from("Interviews")
                .select("jobPosition, type")
                .eq("interview_id", interview_id)
                .single();

            if (!intError) setInterviewInfo(interview);
        } catch (error) {
            console.error("Error fetching feedback:", error);
            toast.error("Failed to load feedback report");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    const { feedback } = feedbackData?.feedback || {};
    const { rating, summery, Recommendation, RecommendationMsg } = feedback || {};

    // Calculate average score
    const ratings = [
        rating?.techicalSkills || 0,
        rating?.communication || 0,
        rating?.problemSolving || 0,
        rating?.experince || 0
    ];
    const overallScore = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);

    const getInitials = (name) => {
        if (!name) return "??";
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full px-5 md:px-10 pb-20 max-w-7xl mx-auto font-sans">
            {/* Top Breadcrumb & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pt-5">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <span className="hover:text-gray-600 cursor-pointer" onClick={() => router.push('/dashboard')}>Dashboard</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-gray-800">Evaluation Report</span>
                </div>
                <Button variant="outline" className="gap-2 bg-white border-gray-200 rounded-xl font-bold shadow-sm">
                    <Download className="h-4 w-4" /> Export PDF
                </Button>
            </div>

            <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Candidate Evaluation</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Profile & Overall Score */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center relative overflow-hidden">
                        <div className="flex justify-center mb-6">
                            <div className="h-24 w-24 bg-gray-50 border-4 border-white shadow-xl rounded-full flex items-center justify-center text-3xl font-black text-gray-800 tracking-tighter">
                                {getInitials(feedbackData?.userName)}
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-1">{feedbackData?.userName}</h2>
                        <p className="text-gray-400 font-bold text-sm mb-8">{interviewInfo?.jobPosition} Applicant</p>

                        <div className="grid grid-cols-2 gap-y-6 text-left border-t border-gray-50 pt-8">
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Applied Date</p>
                                <p className="text-sm font-bold text-gray-700">{formatDate(feedbackData?.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Stage</p>
                                <p className="text-sm font-bold text-green-500">Final Review</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Email</p>
                                <p className="text-sm font-bold text-gray-700 break-all">{feedbackData?.userEmail}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button variant="outline" className="flex-1 gap-2 rounded-xl py-6 font-bold border-gray-100">
                                <Mail className="h-4 w-4" /> Email
                            </Button>
                            <Button variant="outline" className="flex-1 gap-2 rounded-xl py-6 font-bold border-gray-100">
                                <FileUser className="h-4 w-4" /> Resume
                            </Button>
                        </div>
                    </div>

                    {/* Overall Score Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <h3 className="text-lg font-black text-gray-800 mb-8">Overall Score</h3>
                        <div className="flex flex-col items-center">
                            <div className="relative h-40 w-40 flex items-center justify-center mb-8">
                                {/* Circular Progress (Simplified SVG) */}
                                <svg className="h-full w-full rotate-[-90deg]">
                                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                                    <circle
                                        cx="80" cy="80" r="70" fill="transparent" stroke="#10b981" strokeWidth="12"
                                        strokeDasharray={440} strokeDashoffset={440 - (440 * (overallScore / 10))}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-gray-800">{overallScore}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Out of 10</span>
                                </div>
                            </div>
                            <div className="w-full border-t border-gray-50 pt-6 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Benchmark</span>
                                <span className="text-xs font-black text-gray-800">Top 5% of applicants</span>
                            </div>
                            <p className="text-[10px] text-gray-300 font-medium text-center mt-4">Score calculated based on weighted average of all assessment modules.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Performance & Skills */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Recommendation Card (Prominent Top Position) */}
                    <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-white/50">Final Recommendation</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${Recommendation === 'Yes' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {Recommendation === 'Yes' ? <ThumbsUp className="h-6 w-6" /> : <ThumbsDown className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h4 className={`text-xl font-black ${Recommendation === 'Yes' ? 'text-green-400' : 'text-red-400'}`}>
                                        {Recommendation === 'Yes' ? 'Highly Recommended' : 'Not Recommended'}
                                    </h4>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-0.5">Decision based on AI metrics</p>
                                </div>
                            </div>
                            <p className="text-white/60 font-medium text-sm leading-relaxed mb-6">
                                Candidate {Recommendation === 'Yes' ? 'exceeds' : 'does not currently meet'} the core skill requirements for the {interviewInfo?.jobPosition} role.
                            </p>

                            <div className="pt-6 border-t border-white/5">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Note: Evaluation for {interviewInfo?.jobPosition} Position</p>
                            </div>
                        </div>
                        {/* Decorative Background Shape */}
                        <div className={`absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-20 ${Recommendation === 'Yes' ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                    {/* Performance Summary */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-green-500" />
                                <h3 className="text-xl font-bold text-gray-800">Performance Summary</h3>
                            </div>
                            <span className="text-[10px] font-bold text-gray-300 italic">Evaluated by: AI Recruiting Engine</span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-gray-500 font-medium leading-relaxed">
                                {summery}
                            </p>
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl p-6 flex gap-4 border border-blue-100">
                            <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-white text-[10px] font-black">i</span>
                            </div>
                            <div>
                                <h4 className="text-blue-900 font-black text-sm mb-1 uppercase tracking-tight">Key Evaluation Notes</h4>
                                <p className="text-blue-700/80 font-bold text-sm leading-relaxed">
                                    {RecommendationMsg || "Candidate showing strong alignment with role requirements based on identified technical indicators."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Skills Assessment */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-blue-500" />
                                <h3 className="text-xl font-bold text-gray-800">Skills Assessment</h3>
                            </div>
                            <Button variant="link" className="text-green-500 font-black text-xs uppercase tracking-widest p-0">View Full Breakdown</Button>
                        </div>

                        <div className="space-y-10">
                            <SkillBar label="Technical Skills" score={rating?.techicalSkills || 0} color="bg-green-500" subtext="Proficiency in core stack and system architecture." />
                            <SkillBar label="Problem Solving" score={rating?.problemSolving || 0} color="bg-blue-500" subtext="Logic parsing and edge-case handling." />
                            <SkillBar label="Communication" score={rating?.communication || 0} color="bg-purple-500" subtext="Articulation and clarity of expression." />
                            {/* <SkillBar label="Experience & Cultural Fit" score={rating?.experince || 0} color="bg-orange-500" subtext="Industry knowledge and adaptability." /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SkillBar({ label, score, color, subtext }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <div>
                    <h4 className="font-black text-gray-800 text-sm mb-0.5">{label}</h4>
                    <p className="text-[10px] text-gray-400 font-medium italic">{subtext}</p>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-gray-900">{score}</span>
                    <span className="text-[10px] font-bold text-gray-300">/ 10</span>
                </div>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${score * 10}%` }} />
            </div>
            <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
                <span>Developing</span>
                <span>Proficient</span>
                <span>Expert</span>
            </div>
        </div>
    );
}

export default FeedbackReport;
