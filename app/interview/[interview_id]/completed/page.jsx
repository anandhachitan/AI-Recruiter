"use client";
import React from 'react';
import { CheckCircle2, LayoutDashboard, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

function InterviewComplete() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-5 text-center">
            <div className="bg-green-50 p-6 rounded-full animate-bounce">
                <CheckCircle2 className="h-20 w-20 text-green-600" />
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Congratulations! 🎉
                </h1>
                <h2 className="text-xl font-semibold text-gray-700">
                    Your Interview is Complete
                </h2>
                <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                    Great job! The AI has analyzed your performance and saved your feedback to the dashboard.
                    You can now review your results and see where you shined!
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/dashboard">
                    <Button size="lg" className="gap-2 px-10 font-bold shadow-md hover:shadow-lg transition-all">
                        <LayoutDashboard className="h-5 w-5" />
                        View Feedback Dashboard
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="outline" size="lg" className="gap-2 px-10 font-medium">
                        <Home className="h-5 w-5" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default InterviewComplete;