import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Copy, Send, MoreHorizontal, Clock, Calendar, Users, Briefcase, Code2, Terminal, Globe, Palette, Database, Monitor, Atom, PenTool, Braces, Settings } from "lucide-react";
import { toast } from "sonner";

function InterviewCard({ interview }) {
    const router = useRouter();

    const onStart = () => {
        router.push("/interview/" + interview?.interview_id);
    };

    const getJobTheme = (title) => {
        const t = title?.toLowerCase() || "";
        // Backend / Python / Java
        if (t.includes("python") || t.includes("django") || t.includes("flask")) return { icon: Terminal, color: "text-blue-500", bg: "bg-blue-50", hover: "group-hover:text-blue-600" };
        if (t.includes("java") || t.includes("spring") || t.includes("backend") || t.includes("node")) return { icon: Database, color: "text-orange-500", bg: "bg-orange-50", hover: "group-hover:text-orange-600" };

        // Frontend / React / Web
        if (t.includes("react") || t.includes("next")) return { icon: Atom, color: "text-cyan-500", bg: "bg-cyan-50", hover: "group-hover:text-cyan-600" };
        if (t.includes("frontend") || t.includes("web") || t.includes("js") || t.includes("javascript") || t.includes("html")) return { icon: Monitor, color: "text-sky-500", bg: "bg-sky-50", hover: "group-hover:text-sky-600" };

        // Full Stack
        if (t.includes("full stack") || t.includes("mern") || t.includes("mean")) return { icon: Globe, color: "text-purple-500", bg: "bg-purple-50", hover: "group-hover:text-purple-600" };

        // Design
        if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("figma") || t.includes("product designer")) return { icon: PenTool, color: "text-pink-500", bg: "bg-pink-50", hover: "group-hover:text-pink-600" };

        // Data / AI
        if (t.includes("data") || t.includes("ai") || t.includes("ml") || t.includes("machine learning") || t.includes("intelligence")) return { icon: Braces, color: "text-indigo-500", bg: "bg-indigo-50", hover: "group-hover:text-indigo-600" };

        // Default
        return { icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50", hover: "group-hover:text-blue-700" };
    };

    const theme = getJobTheme(interview?.jobPosition);

    const onFeedback = () => {
        router.push("/interview/" + interview?.interview_id + "/completed");
    };

    const onCopy = () => {
        const url = window.location.origin + "/interview/" + interview?.interview_id;
        navigator.clipboard.writeText(url);
        toast("Link Copied!");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Determine status color/badge (Mocking for now as we don't have status in DB yet)
    const status = interview?.status || "Active";
    const statusConfig = {
        Active: "bg-green-50 text-green-600",
        Closed: "bg-gray-100 text-gray-500",
        Paused: "bg-yellow-50 text-yellow-600"
    };

    return (
        <div
            className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            onClick={() => router.push("/dashboard/interview/" + interview?.interview_id)}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                    <div className={`h-12 w-12 ${theme.bg} flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <theme.icon className={`h-6 w-6 ${theme.color}`} />
                    </div>
                    <div>
                        <h2 className={`font-extrabold text-gray-800 text-lg leading-tight transition-colors duration-300 ${theme.hover}`}>
                            {interview?.jobPosition}
                        </h2>
                        {/* <h2 className="text-xs text-gray-400 font-bold uppercase mt-0.5">ID: #INT-{interview?.id || '0000'}</h2> */}
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-300" onClick={(e) => { e.stopPropagation(); /* Prevents navigation when clicking menu */ }}>
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>

            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-500 transition-colors">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{interview?.duration} duration</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-500 transition-colors">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium text-gray-500">Created {formatDate(interview?.created_at)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-500 transition-colors">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">12 Candidates applied</span>
                </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50/80 p-2 rounded-2xl group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all duration-300">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${statusConfig[status] || statusConfig.Active}`}>
                    • {status}
                </span>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-gray-400 hover:text-gray-600 hover:bg-white bg-transparent shadow-none"
                        onClick={(e) => { e.stopPropagation(); onCopy(); }}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        className="h-10 px-6 gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 font-bold active:scale-95 transition-all"
                        onClick={(e) => { e.stopPropagation(); onStart(); }}
                    >
                        Send <Send className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default InterviewCard;
