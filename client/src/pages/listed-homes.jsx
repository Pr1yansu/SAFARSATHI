import React from "react";
import { useGetCurrentUserListedHomesQuery } from "../store/apis/touristspots";
import TouristSpotCard from "../components/ui/tourist-spot-card";
import { HiHome, HiPlus, HiSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";
import useModal from "../components/hooks/modal";

const ListedHomes = () => {
  const openModal = useModal((state) => state.open);
  const {
    data: listedHomes,
    isLoading: listedHomesIsLoading,
  } = useGetCurrentUserListedHomesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const homes = Array.isArray(listedHomes) ? listedHomes : [];

  return (
    <div className="min-h-screen pb-16 gradient-hero-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shadow-xs">
              <HiSparkles className="text-indigo-600" />
              <span>Host Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Your Property Listings</h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg">
              Manage your hosted homes, update descriptions, and track guest availability across your listed destinations.
            </p>
          </div>

          <button
            onClick={() => openModal("rent")}
            className="flex items-center gap-2 px-6 py-3.5 gradient-bg-primary text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <HiPlus size={18} />
            <span>List New Property</span>
          </button>
        </div>

        {/* Listings Grid or Skeletons or Empty State */}
        {listedHomesIsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-3.5 space-y-3 border border-slate-200/80 shadow-card animate-pulse">
                <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl"></div>
                <div className="h-5 bg-slate-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
              </div>
            ))}
          </div>
        ) : homes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {homes.map((home, index) => (
              <TouristSpotCard
                key={home._id}
                touristSpot={home}
                index={index}
                shareIcon={true}
                requestVerification={true}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-card max-w-xl mx-auto space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <HiHome size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Properties Listed Yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Share your home or unique luxury stay with thousands of travelers across India. It takes less than 2 minutes to publish your first spot.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openModal("rent")}
                className="px-6 py-3.5 gradient-bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                List Your Home Now
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ListedHomes;
