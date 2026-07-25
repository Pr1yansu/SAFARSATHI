import React from "react";
import { useSelector } from "react-redux";
import { useGetTouristSpotByIdsQuery } from "../store/apis/touristspots";
import Loader from "../components/ui/loader";
import TouristSpotCard from "../components/ui/tourist-spot-card";
import { HiHeart } from "react-icons/hi2";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FavoriteListings = () => {
  const likedSpots = useSelector((state) => state.likedSpots.likedSpots);
  const {
    data: touristSpots,
    isLoading: touristSpotsIsLoading,
    isFetching: touristSpotsIsFetching,
  } = useGetTouristSpotByIdsQuery(likedSpots, {
    refetchOnMountOrArgChange: true,
  });

  if (touristSpotsIsLoading || touristSpotsIsFetching) {
    return <Loader />;
  }

  const spots = Array.isArray(touristSpots) ? touristSpots : [];

  return (
    <div className="min-h-screen pb-16 gradient-hero-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Hero Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold shadow-xs">
              <HiHeart className="text-rose-500" />
              <span>Saved Destinations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Your Wishlist</h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg">
              Explore your bookmarked luxury stays, heritage homestays, and favorite tourist destinations.
            </p>
          </div>

          <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-4 py-2 rounded-full border border-slate-200">
            {likedSpots.length} Bookmarked
          </span>
        </div>

        {/* Listings Grid or Empty State */}
        {likedSpots.length > 0 && spots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {spots.map((spot, index) => (
              <TouristSpotCard key={spot._id} touristSpot={spot} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-card max-w-xl mx-auto space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
              <HiHeart size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Saved Favorites Yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Tap the heart icon on any destination or luxury property to save it to your personal wishlist for easy planning.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-block px-6 py-3.5 gradient-bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Explore Destinations
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default FavoriteListings;
