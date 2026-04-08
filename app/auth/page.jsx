"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/services/supabaseClient";
import { Eye, EyeOff, Lock, Mail, Github, Chrome, ArrowRight, Sparkles, CheckCircle2, UserPlus, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    companyName: "",
    companyAddress: ""
  });

  const onHandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        document.cookie = `supabase-auth-token=${session.access_token}; path=/; max-age=3600;`;
        router.replace("/dashboard");
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        document.cookie = `supabase-auth-token=${session.access_token}; path=/; max-age=3600;`;
        router.replace("/dashboard");
      } else if (event === "SIGNED_OUT") {
        document.cookie = `supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    });

    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard"
        }
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error.message || "Google Sign-in failed");
      setGoogleLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long! 🔐❌");
      return;
    }
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up logic
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              phoneNumber: formData.phoneNumber,
              password: formData.password,
              isRecruiter: isRecruiter,
              companyName: isRecruiter ? formData.companyName : null,
              companyAddress: isRecruiter ? formData.companyAddress : null,
            },
            emailRedirectTo: window.location.origin + "/dashboard"
          }
        });

        if (error) throw error;

        if (data?.user?.identities?.length === 0) {
          toast.info("This email is already registered. Please sign in instead! 👤ℹ️");
          setIsSignUp(false);
        } else {
          toast.success("Account created! Please check your email for verification. 🚀");
          setIsSignUp(false);
        }
      } else {
        // Sign In logic
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast.success("Welcome back! Redirecting... 🏁✨");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error(error.message || "Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <div className="w-full flex flex-col md:flex-row overflow-hidden">

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 lg:p-24 flex flex-col justify-center">
          <div className="mb-10 flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black text-gray-800 tracking-tight">AI Recruiter</span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
              {isSignUp ? "Join AI Recruiter" : "Welcome Back"}
            </h1>
            <p className="text-gray-400 font-medium tracking-wide">
              {isSignUp ? "Create an account to start your hiring journey." : "Please enter your details to sign in."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isSignUp && (
              <>
                <div className="flex gap-4">
                  <div className="space-y-2 w-1/2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-600">
                        <UserPlus className="h-5 w-5" />
                      </div>
                      <Input
                        name="firstName"
                        placeholder="First Name"
                        required
                        className="pl-14 pr-6 py-7 border-2 border-gray-50 bg-gray-50/30 rounded-2xl focus:border-blue-600 focus:bg-white transition-all text-gray-700 font-bold"
                        onChange={onHandleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 w-1/2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                    <div className="relative group">
                      <Input
                        name="lastName"
                        placeholder="Last Name"
                        required
                        className="px-6 py-7 border-2 border-gray-50 bg-gray-50/30 rounded-2xl focus:border-blue-600 focus:bg-white transition-all text-gray-700 font-bold"
                        onChange={onHandleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <Input
                    name="phoneNumber"
                    placeholder="+1 234 567 890"
                    required
                    className="px-6 py-7 border-2 border-gray-50 bg-gray-50/30 rounded-2xl focus:border-blue-600 focus:bg-white transition-all text-gray-700 font-bold"
                    onChange={onHandleChange}
                  />
                </div>

                <div className="flex items-center gap-2 px-1 mt-4">
                  <input 
                    type="checkbox" 
                    id="recruiter" 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={isRecruiter}
                    onChange={(e) => setIsRecruiter(e.target.checked)} 
                  />
                  <label htmlFor="recruiter" className="text-sm font-bold text-gray-700 cursor-pointer">I am registering as a Recruiter</label>
                </div>

                {isRecruiter && (
                  <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                      <Input
                        name="companyName"
                        placeholder="Google, Inc."
                        required
                        className="px-6 py-7 border-2 border-gray-50 bg-white rounded-2xl focus:border-blue-600 transition-all text-gray-700 font-bold"
                        onChange={onHandleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Address</label>
                      <Input
                        name="companyAddress"
                        placeholder="1600 Amphitheatre Parkway..."
                        required
                        className="px-6 py-7 border-2 border-gray-50 bg-white rounded-2xl focus:border-blue-600 transition-all text-gray-700 font-bold"
                        onChange={onHandleChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="pl-14 pr-6 py-7 border-2 border-gray-50 bg-gray-50/30 rounded-2xl focus:border-blue-600 focus:bg-white transition-all text-gray-700 font-bold"
                  onChange={onHandleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                {!isSignUp && <a href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot Password?</a>}
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-600">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pl-14 pr-14 py-7 border-2 border-gray-50 bg-gray-50/30 rounded-2xl focus:border-blue-600 focus:bg-white transition-all text-gray-700 font-bold"
                  onChange={onHandleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center gap-2 px-1">
                <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="remember" className="text-xs font-medium text-gray-500">Remember me for 30 days</label>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-7 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-100 flex gap-3 transition-all active:scale-95 text-lg"
            >
              {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              {!loading && (isSignUp ? <ArrowRight className="h-5 w-5" /> : <LogIn className="h-5 w-5" />)}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-white px-4 text-gray-300 font-bold">Or continue with</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={googleLoading}
              onClick={signInWithGoogle}
              className="py-7 rounded-2xl border-2 border-gray-50 font-black text-gray-800 hover:bg-gray-50 transition-all flex gap-3 shadow-sm disabled:opacity-50"
            >
              <Chrome className={`h-5 w-5 text-red-500 ${googleLoading ? 'animate-spin' : ''}`} />
              {googleLoading ? "Signing in with Google..." : "Sign in with Google"}
            </Button>
          </div>

          <p className="mt-10 text-center text-sm font-bold text-gray-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              {isSignUp ? "Sign in instead" : "Sign up for free"}
            </button>
          </p>

          <div className="mt-auto pt-10 flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            <span>© 2024 AI Recruiter Inc.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-600">Privacy</a>
              <a href="#" className="hover:text-gray-600">Terms</a>
            </div>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden md:flex w-1/2 bg-blue-50/50 p-16 lg:p-24 flex-col justify-center items-center relative overflow-hidden">
          {/* Decorative elements to mimic the high-fidelity design */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white rounded-full blur-[120px] opacity-60" />
          <div className="absolute top-20 right-20 h-4 w-4 bg-red-500 rounded-full" />
          <div className="absolute bottom-40 left-10 h-3 w-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-100" />

          <div className="relative z-10 w-full max-w-lg">
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-50/50 transform -rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Candidate Status</p>
                  <p className="text-lg font-black text-gray-800 tracking-tight">Verified Expert</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-3/4 rounded-full" />
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-1/2 rounded-full" />
                </div>
              </div>
              <div className="mt-10 flex justify-between items-center text-gray-300">
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-50" />
                  <div className="h-8 w-8 rounded-full bg-orange-50" />
                  <div className="h-8 w-8 rounded-full bg-purple-50" />
                </div>
                <Sparkles className="h-6 w-6 opacity-30" />
              </div>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-2xl font-black text-gray-800 mb-4 tracking-tight">Smart Hiring Decisions</h2>
              <p className="text-gray-400 font-medium leading-relaxed">
                Leverage AI to screen candidates, schedule interviews, and find the perfect match for your team 10x faster.
              </p>
            </div>

            <div className="mt-10 flex justify-center gap-3">
              <div className="h-2 w-8 bg-blue-600 rounded-full" />
              <div className="h-2 w-2 bg-blue-200 rounded-full" />
              <div className="h-2 w-2 bg-blue-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
