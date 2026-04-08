import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Video } from "lucide-react";
import Image from "next/image";

const UPCOMING_MOCK = [
    { id: 1, name: 'Michael Scott', role: 'Sales Manager', time: 'Today, 2:00 PM', status: 'Confirmed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop' },
    { id: 2, name: 'Sarah Connor', role: 'Security Analyst', time: 'Tomorrow, 10:00 AM', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' },
    { id: 3, name: 'Jim Halpert', role: 'Sales Representative', time: 'Oct 28, 11:30 AM', status: 'Confirmed', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' },
];

function UpcomingInterviews() {
    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm my-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Upcoming Interviews</h2>
                <Button variant="link" className="text-blue-600 font-bold p-0">View Calendar</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
                            <th className="pb-4 font-bold">Candidate</th>
                            <th className="pb-4 font-bold">Role</th>
                            <th className="pb-4 font-bold">Date & Time</th>
                            <th className="pb-4 font-bold">Status</th>
                            <th className="pb-4 text-right font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {UPCOMING_MOCK.map((item) => (
                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="py-5">
                                    <div className="flex items-center gap-3">
                                        <img src={item.avatar} alt="" className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                        <span className="font-bold text-gray-700">{item.name}</span>
                                    </div>
                                </td>
                                <td className="py-5 text-sm text-gray-500 font-medium">{item.role}</td>
                                <td className="py-5 text-sm text-gray-500 font-medium">{item.time}</td>
                                <td className="py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'Confirmed' ? 'bg-blue-50 text-blue-500' : 'bg-yellow-50 text-yellow-600'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                            <Video className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UpcomingInterviews;
