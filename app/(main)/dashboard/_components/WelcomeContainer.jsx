"use client";
import React from "react";
import { useUser } from "@/app/provider";
import { useViewMode } from "@/app/(main)/provider";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, Bell, LogOut, Settings, User as UserIcon, Shield, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

function WelcomeContainer() {
  const { user, setUser } = useUser();
  const { viewMode, setViewMode } = useViewMode();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const showSwitch = user?.isAdmin && user?.isRecruiter;

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      document.cookie = `supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      setUser(null);
      window.location.href = "/auth";
    }
  };

  const handleSwitch = () => {
    setViewMode(viewMode === "recruiter" ? "admin" : "recruiter");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
          Welcome Back, {user?.name || user?.fullName || 'User'}
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-100" />
        </h2>
        <p className="text-gray-400 font-medium mt-1 uppercase text-[10px] tracking-widest font-black">
          AI-Driven Interviews. Hassle-Free Hiring.
        </p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* Switch Button — only for Admin+Recruiter users */}
        {showSwitch && (
          <Button
            onClick={handleSwitch}
            className={`gap-2 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg active:scale-95 transition-all ${
              viewMode === "recruiter"
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-100"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
            }`}
          >
            {viewMode === "recruiter" ? (
              <>
                <Shield className="h-4 w-4" /> Switch to Admin
              </>
            ) : (
              <>
                <Briefcase className="h-4 w-4" /> Switch to Recruiter
              </>
            )}
          </Button>
        )}

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-transparent focus:border-blue-600 rounded-2xl shadow-xl shadow-gray-100 focus:ring-0 outline-none text-sm transition-all text-gray-700 font-bold"
          />
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12 bg-white border-gray-50 rounded-2xl shadow-xl shadow-gray-100 text-gray-400 hover:text-blue-600">
          <Bell className="h-5 w-5" />
        </Button>

        {user && (
          <div className="relative">
            <div
              className="cursor-pointer group relative"
              onClick={() => setOpen(!open)}
            >
              {user?.imageUrl || user?.picture ? (
                <Image
                  src={user?.imageUrl || user?.picture}
                  alt="userAvatar"
                  width={48}
                  height={48}
                  className="rounded-2xl border-4 border-white shadow-xl shadow-blue-50 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="h-12 w-12 bg-blue-100 rounded-2xl border-4 border-white shadow-xl shadow-blue-50 group-hover:scale-105 transition-transform flex items-center justify-center text-blue-600 font-extrabold text-lg">
                  {user?.name?.charAt(0) || user?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
            </div>

            {open && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpen(false)}
                />
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-[2rem] shadow-2xl border border-gray-50 p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-gray-50 flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black">
                      {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-black text-gray-800 truncate">{user?.name || user?.fullName}</p>
                      <p className="text-[10px] text-gray-400 font-bold truncate tracking-tight">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setOpen(false); router.push("/settings"); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"
                    >
                      <UserIcon className="h-4 w-4" /> Profile Details
                    </button>
                    <button
                      onClick={() => { setOpen(false); router.push("/settings"); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"
                    >
                      <Settings className="h-4 w-4" /> Account Settings
                    </button>
                    <div className="h-px bg-gray-50 my-1" />
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomeContainer;
