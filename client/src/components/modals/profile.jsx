import React, { useEffect, useState } from "react";
import { useProfileQuery } from "../../store/apis/user";
import { motion, AnimatePresence } from "framer-motion";
import useModal from "../hooks/modal";
import { IoCloseOutline } from "react-icons/io5";
import { HiUser, HiEnvelope, HiShieldCheck, HiSparkles, HiCamera, HiCalendar, HiHome } from "react-icons/hi2";
import toast from "react-hot-toast";

const ProfileModal = () => {
  const { data: profile } = useProfileQuery();
  const { close: closeModal, isOpen: isModalOpen, variant } = useModal();
  const [data, setData] = useState({
    name: "",
    email: "",
    role: "",
    avatar: "",
  });

  useEffect(() => {
    if (profile) {
      setData(profile);
    }
  }, [profile]);

  if (!isModalOpen || variant !== "profile") {
    return null;
  }

  const handleSave = () => {
    toast.success("Profile details saved successfully!");
    closeModal();
  };

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={closeModal}
        >
          <motion.div
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 max-w-lg w-full relative space-y-6 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-10"
            >
              <IoCloseOutline size={20} />
            </button>

            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shadow-xs mb-1">
                  <HiSparkles className="text-indigo-600" />
                  <span>Guest & Host Profile</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Account & Insights</h3>
              </div>
              <span className="capitalize px-3 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-full shadow-xs">
                {profile.role || "User"}
              </span>
            </div>

            {/* Account Insights Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center space-y-1">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status</p>
                <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-black">
                  <HiShieldCheck size={16} />
                  <span>Verified</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center space-y-1">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Member</p>
                <div className="flex items-center justify-center gap-1 text-indigo-600 text-xs font-black">
                  <HiCalendar size={16} />
                  <span>Active</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center space-y-1">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tier</p>
                <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-black">
                  <HiHome size={16} />
                  <span>Traveler</span>
                </div>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
              <div className="relative group shrink-0">
                {data.avatar || profile.avatar ? (
                  <img
                    src={data.avatar || profile.avatar}
                    alt={profile.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center border-2 border-white shadow-md">
                    {profile.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer">
                  <HiCamera size={20} />
                </div>
              </div>

              <div className="space-y-1 flex-1">
                <label className="text-xs font-bold text-slate-800">Profile Photo</label>
                <input
                  type="text"
                  placeholder="Paste image URL or avatar link"
                  value={data.avatar}
                  onChange={(e) => setData({ ...data, avatar: e.target.value })}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 font-medium">Supports JPG, PNG, WebP image links</p>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative flex items-center">
                  <HiUser className="absolute left-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative flex items-center">
                  <HiEnvelope className="absolute left-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 gradient-bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;

