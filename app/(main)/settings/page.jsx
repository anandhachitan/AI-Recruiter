"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Loader2, User as UserIcon, Building2, Phone, MapPin } from "lucide-react";
import WelcomeContainer from "../dashboard/_components/WelcomeContainer";

function SettingsPage() {
  const { user, setUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    companyName: "",
    companyAddress: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        companyName: user.companyName || "",
        companyAddress: user.companyAddress || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First name and last name are required.");
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim() || null,
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      };

      // Include company fields only for recruiters
      if (user?.isRecruiter) {
        updateData.companyName = form.companyName.trim() || null;
        updateData.companyAddress = form.companyAddress.trim() || null;
      }

      const { data, error } = await supabase
        .from("Users")
        .update(updateData)
        .eq("email", user.email)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setUser(data[0]);
        toast.success("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="p-10 flex justify-center text-gray-400 font-bold">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="w-full px-5 md:px-10 pb-20 pt-8 md:pt-14">
      <WelcomeContainer />

      <div className="mt-8 mb-6">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">
          Account Settings
        </h2>
        <p className="text-gray-500 font-medium text-sm mt-1">
          Update your personal information and preferences.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Personal Information */}
        <div className="bg-white border-2 border-gray-50 rounded-3xl overflow-hidden shadow-sm p-8 mb-6">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-6">
            <UserIcon className="h-4 w-4 text-blue-600" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                First Name *
              </label>
              <Input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter first name"
                className="py-6 rounded-2xl border-gray-100 font-bold text-gray-800 focus:border-blue-600 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                Last Name *
              </label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter last name"
                className="py-6 rounded-2xl border-gray-100 font-bold text-gray-800 focus:border-blue-600 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone Number
              </label>
              <Input
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="Enter phone number"
                className="py-6 rounded-2xl border-gray-100 font-bold text-gray-800 focus:border-blue-600 shadow-sm"
              />
            </div>


          </div>
        </div>

        {/* Company Details — only for Recruiters */}
        {user?.isRecruiter && (
          <div className="bg-white border-2 border-gray-50 rounded-3xl overflow-hidden shadow-sm p-8 mb-6">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-6">
              <Building2 className="h-4 w-4 text-blue-600" />
              Company Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Company Name
                </label>
                <Input
                  value={form.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                  className="py-6 rounded-2xl border-gray-100 font-bold text-gray-800 focus:border-blue-600 shadow-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Company Address
                </label>
                <Input
                  value={form.companyAddress}
                  onChange={(e) =>
                    handleChange("companyAddress", e.target.value)
                  }
                  placeholder="Enter company address"
                  className="py-6 rounded-2xl border-gray-100 font-bold text-gray-800 focus:border-blue-600 shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Account Info — Read only */}
        <div className="bg-white border-2 border-gray-50 rounded-3xl overflow-hidden shadow-sm p-8 mb-8">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-6">
            Account Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Email
              </p>
              <p className="font-bold text-sm text-gray-700">{user?.email}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Role
              </p>
              <div className="flex gap-2 mt-1">
                {user?.isAdmin && (
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-black uppercase">
                    Admin
                  </span>
                )}
                {user?.isRecruiter && (
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                    Recruiter
                  </span>
                )}
                {!user?.isAdmin && !user?.isRecruiter && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase">
                    Candidate
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-all text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
