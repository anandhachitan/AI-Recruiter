"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot, Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

function ActionCards() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {/* Create New Interview Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Bot className="h-7 w-7 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Interview</h2>
                <p className="text-gray-500 mb-8 max-w-[300px]">Create AI-driven interviews tailored to job descriptions instantly.</p>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg rounded-2xl shadow-lg shadow-blue-100 flex items-center gap-2"
                    onClick={() => router.push('/dashboard/create-interview')}
                >
                    Get Started <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Phone Screening Call Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Calendar className="h-7 w-7 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Phone Screening Call</h2>
                <p className="text-gray-500 mb-8 max-w-[300px]">Schedule automated phone screening calls to qualify candidates before technical rounds.</p>
                <Button
                    variant="outline"
                    className="border-2 border-gray-100 hover:bg-gray-50 px-8 py-6 text-lg rounded-2xl flex items-center gap-2 font-bold"
                >
                    Schedule Call <Calendar className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

export default ActionCards;
