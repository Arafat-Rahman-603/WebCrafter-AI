"use client";

import React, { useEffect, useState, useRef } from "react";
import Navber from "@/componentes/Navber";
import { motion, AnimatePresence } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser, updateProfileUserInfo, uploadAvatarUserInfo } from "@/redux/slices/authSlice";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading, isInitialized } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        router.push("/login");
      } else if (!isEditing) {
        setFormData((prev) => {
          if (prev.name === (user.name || "") && prev.bio === (user.bio || "")) {
            return prev;
          }
          return {
            name: user.name || "",
            bio: user.bio || "",
          };
        });
      }
    }
  }, [user, isInitialized, isEditing, router]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSaveProfile = async () => {
    setMessage({ type: "", text: "" });
    try {
      const resultAction = await dispatch(updateProfileUserInfo(formData));
      if (updateProfileUserInfo.fulfilled.match(resultAction)) {
        setIsEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: resultAction.payload || "Failed to update profile" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" });
      return;
    }

    const data = new FormData();
    data.append("avatar", file);

    try {
      const resultAction = await dispatch(uploadAvatarUserInfo(data));
      if (uploadAvatarUserInfo.fulfilled.match(resultAction)) {
        setMessage({ type: "success", text: "Avatar updated successfully!" });
      } else {
        setMessage({ type: "error", text: resultAction.payload || "Failed to upload avatar" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to upload avatar" });
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        {/* Decorative Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">Account Settings</h1>
              <p className="text-slate-400">Manage your profile information and security preferences.</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium border border-red-500/20 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </motion.div>

          {message.text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-8 p-4 rounded-xl border ${
                message.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${
                  activeTab === "profile" 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-semibold">My Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("usage")}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${
                  activeTab === "usage" 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-semibold">Usage & Plan</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
                      <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-white/5">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 p-[3px] shadow-2xl shadow-blue-500/20 transition-transform group-hover:scale-105">
                            {user.profilePicture ? (
                              <Image 
                                src={user.profilePicture} 
                                alt={user.name} 
                                width={128}
                                height={128}
                                loading="lazy"
                                className="w-full h-full rounded-full object-cover bg-[#0a0f1e]"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-[#0a0f1e] flex items-center justify-center text-4xl font-bold text-white uppercase">
                                {user.name ? user.name.charAt(0) : "U"}
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                          />
                        </div>
                        <div className="text-center md:text-left flex-1">
                          <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                          <p className="text-slate-400 mb-4">{user.email}</p>
                          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                              {user.plan?.toUpperCase() || "FREE"} PLAN
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                              VERIFIED
                            </span>
                          </div>
                        </div>
                        <div>
                          {!isEditing ? (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all"
                            >
                              Edit Profile
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl font-semibold transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={onSaveProfile}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
                              >
                                {isLoading ? "Saving..." : "Save Changes"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Full Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                            />
                          ) : (
                            <p className="text-lg text-slate-200 font-medium px-1">{user.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Bio</label>
                          {isEditing ? (
                            <textarea
                              name="bio"
                              rows={4}
                              value={formData.bio}
                              onChange={handleInputChange}
                              placeholder="Tell us about yourself..."
                              className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none"
                            />
                          ) : (
                            <p className="text-slate-400 bg-white/5 border border-white/5 rounded-2xl p-5 leading-relaxed min-h-[100px]">
                              {user.bio || "No bio added yet. Click edit to add one!"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "usage" && (
                  <motion.div
                    key="usage"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white">Current Statistics</h3>
                        <Link href="/pricing" className="text-sm text-blue-400 font-bold hover:text-blue-300 transition-colors bg-blue-500/5 px-4 py-2 rounded-xl border border-blue-500/10">Manage Subscription</Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Available Credits</p>
                            <h4 className="text-4xl font-extrabold text-white">{user.credits || 0}</h4>
                         </div>
                         <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Plan Type</p>
                            <h4 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 uppercase">
                              {user.plan || "Free"}
                            </h4>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-bold text-slate-300">Generations Used</span>
                            <span className="text-sm font-bold text-slate-500">0 / 3 per month</span>
                         </div>
                         <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "2%" }}
                              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                         </div>
                         <p className="text-xs text-slate-500">Credits reset on {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
