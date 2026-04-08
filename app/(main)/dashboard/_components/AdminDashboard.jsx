"use client"
import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import WelcomeContainer from "./WelcomeContainer";
import { Button } from "@/components/ui/button";
import { Trash2, Shield, Briefcase, User as CandidateIcon, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("Users").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleToggleRole = async (userId, roleType, currentValue) => {
    const field = roleType === 'admin' ? 'isAdmin' : 'isRecruiter';
    const { error } = await supabase.from("Users").update({ [field]: !currentValue }).eq("id", userId);
    
    if (error) {
      toast.error("Failed to update role");
    } else {
      toast.success(`${roleType} role updated!`);
      fetchUsers();
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user profile?")) return;
    
    const { error } = await supabase.from("Users").delete().eq("id", userId);
    if (error) {
      toast.error("Failed to delete user");
    } else {
      toast.success("User deleted successfully");
      fetchUsers();
    }
  };

  return (
    <>
      <WelcomeContainer />
      
      <div className="flex justify-between items-center mt-8 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Admin Console</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage users, roles, and platform settings.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchUsers} disabled={loading} className="gap-2 font-bold text-gray-500 border-gray-100 bg-white">
            <RefreshCw className={`h-4 w-4 ${loading && 'animate-spin'}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-50 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <th className="p-5">User</th>
              <th className="p-5">Role Status</th>
              <th className="p-5">Company / Ph</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-blue-50/10 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-black shrink-0">
                      {u.firstName?.charAt(0) || u.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-800 text-sm">{u.firstName} {u.lastName}</p>
                      <p className="text-xs font-bold text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex gap-2">
                    {u.isAdmin ? (
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-black uppercase flex items-center gap-1"><Shield className="h-3 w-3"/> Admin</span>
                    ) : null}
                    {u.isRecruiter ? (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase flex items-center gap-1"><Briefcase className="h-3 w-3"/> Recruiter</span>
                    ) : (!u.isAdmin && !u.isRecruiter) ? (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase flex items-center gap-1"><CandidateIcon className="h-3 w-3"/> Candidate</span>
                    ) : null}
                  </div>
                </td>
                <td className="p-5">
                  {u.isRecruiter && u.companyName ? (
                    <div>
                      <p className="font-bold text-xs text-gray-700">{u.companyName}</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400 truncate w-32">{u.companyAddress}</p>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-gray-400">{u.phoneNumber || 'N/A'}</p>
                  )}
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs h-8">
                      <Eye className="h-3 w-3 mr-1" /> View
                    </Button>
                    <div className="w-px h-8 bg-gray-100 mx-1" />
                    <Button variant="ghost" size="icon" onClick={() => handleToggleRole(u.id, 'recruiter', u.isRecruiter)} title="Toggle Recruiter" className={`h-8 w-8 ${u.isRecruiter ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'}`}>
                      <Briefcase className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleRole(u.id, 'admin', u.isAdmin)} title="Toggle Admin" className={`h-8 w-8 ${u.isAdmin ? 'text-purple-600 bg-purple-50' : 'text-gray-400 hover:text-purple-600'}`}>
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)} className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-bold text-sm">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-50/50 p-8 border-b border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-5">
                 <div className="h-16 w-16 bg-white border-4 border-white shadow-xl shadow-gray-200 rounded-2xl flex items-center justify-center font-black text-2xl text-blue-600 shrink-0">
                    {selectedUser.firstName?.charAt(0) || selectedUser.email?.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-gray-800">{selectedUser.firstName} {selectedUser.lastName}</h3>
                   <p className="text-gray-400 font-bold text-xs mt-1 tracking-tight">{selectedUser.email}</p>
                   <div className="flex gap-2 mt-2">
                      {selectedUser.isAdmin && <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-[9px] font-black uppercase">Admin</span>}
                      {selectedUser.isRecruiter && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-[9px] font-black uppercase">Recruiter</span>}
                   </div>
                 </div>
               </div>
               <button onClick={() => setSelectedUser(null)} className="h-8 w-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 shadow-sm transition-all pb-1 active:scale-95">
                 <span className="text-xl font-bold leading-none">&times;</span>
               </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                  <p className="font-bold text-sm text-gray-700">{selectedUser.phoneNumber || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Created</p>
                  <p className="font-bold text-sm text-gray-700">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedUser.isRecruiter && (
                <div className="bg-blue-50/30 rounded-2xl p-4 border border-blue-50">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-1"><Briefcase className="h-3 w-3"/> Company Details</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Company Name</p>
                      <p className="font-bold text-sm text-gray-800">{selectedUser.companyName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Address</p>
                      <p className="font-bold text-xs text-gray-600 leading-relaxed">{selectedUser.companyAddress || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
