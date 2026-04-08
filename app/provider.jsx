"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import { User } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    // 1. Check initial session
    CheckUser();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Change:", event, session?.user?.email);

      if (session?.user) {
        await GetUserDetail(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const CheckUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await GetUserDetail(user);
    } else {
      // Mismatch failsafe: if local session is empty but middleware let us through,
      // it means the cookie is stale. Clear the cookie and redirect to login.
      document.cookie = `supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      window.location.href = "/auth";
    }
  };

  const GetUserDetail = async (authUser) => {
    try {
      let { data: Users, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", authUser?.email);

      if (error) throw error;

      if (Users?.length === 0) {
        // Create new user if doesn't exist in DB
        const { data, error: insertError } = await supabase
          .from("Users")
          .insert({
            email: authUser?.email,
            firstName: authUser?.user_metadata?.firstName || authUser?.user_metadata?.full_name?.split(' ')[0] || 'User',
            lastName: authUser?.user_metadata?.lastName || authUser?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            phoneNumber: authUser?.user_metadata?.phoneNumber || null,
            password: authUser?.user_metadata?.password || null,
            isRecruiter: authUser?.email === 'anandhachitan03@gmail.com' ? true : (authUser?.user_metadata?.isRecruiter || false),
            isAdmin: authUser?.email === 'anandhachitan03@gmail.com' ? true : false,
            companyName: authUser?.user_metadata?.companyName || null,
            companyAddress: authUser?.user_metadata?.companyAddress || null,
            name: authUser?.user_metadata?.name || authUser?.user_metadata?.full_name || 'User',
            picture: authUser?.user_metadata?.picture || authUser?.user_metadata?.avatar_url,
          })
          .select();

        if (insertError) throw insertError;
        if (data && data.length > 0) setUser(data[0]);
      } else {
        setUser(Users[0]);
      }
    } catch (error) {
      console.error("Error in GetUserDetail:", error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  const context = useContext(UserDetailContext);
  return context;
};
