"use client";
import { supabase } from "@/services/supabaseClient";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState();
  useEffect(() => {
    CreateNewUser();
  }, []);

  const CreateNewUser = () => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      let { data: Users, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", user?.email);

      console.log(Users);
      if (Users?.length == 0) {
        const { data, error } = await supabase.from("Users").insert({
          email: user?.email,
          name: user?.user_metadata?.name,
          picture: user?.user_metadata?.picture,
        });
        console.log(data);
        setUser(data);
        return;
      }
      setUser(User[0]);
    });
  };
  return <div>{children}</div>;
}

export default Provider;
