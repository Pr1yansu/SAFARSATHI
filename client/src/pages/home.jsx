import React, { useEffect } from "react";
import { useGetCategoriesQuery } from "../store/apis/categories";
import { IconPickerItem } from "react-icons-picker";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useGetTouristSpotsQuery } from "../store/apis/touristspots";
import Loader from "../components/ui/loader";
import TouristSpotCard from "../components/ui/tourist-spot-card";
import Button from "../components/ui/button";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { HiSparkles, HiShieldCheck, HiChevronLeft, HiChevronRight, HiCalendar, HiUserGroup, HiMapPin, HiStar } from "react-icons/hi2";
import { FaCompass } from "react-icons/fa";
import useModal from "../components/hooks/modal";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const openModal = useModal((state) => state.open);

  const {
    data: categories,
    isLoading,
  } = useGetCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(12);
  const [spots, setSpots] = React.useState([]);

  const {
    data: touristSpots,
    isLoading: touristSpotsIsLoading,
    isFetching: touristSpotsIsFetching,
  } = useGetTouristSpotsQuery({
    page: page,
    limit: limit,
    category: searchParams.get("category"),
    location: searchParams.get("location"),
    checkin: searchParams.get("checkin"),
    checkout: searchParams.get("checkout"),
    guests: searchParams.get("guests"),
    rooms: searchParams.get("rooms"),
    adults: searchParams.get("adults"),
    children: searchParams.get("children"),
    infants: searchParams.get("infants"),
  }, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!touristSpotsIsLoading && touristSpots?.touristSpots) {
      setSpots(touristSpots.touristSpots);
    }
  }, [touristSpots, touristSpotsIsLoading]);

  useEffect(() => {
    setPage(1);
  }, [searchParams]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return <Loader />;
  }

  const activeCategory = searchParams.get("category");

  return (
    <div className="min-h-screen pb-16 gradient-hero-bg">
      {/* Luxury Hero Banner Section */}
      <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8 relative z-10 text-center">
          <div className="space-y-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold shadow-xs backdrop-blur-sm"
            >
              <HiSparkles className="text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>India's Premier Travel & Stay Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]"
            >
              Find Your Next <br className="hidden sm:inline" />
              <span className="gradient-text">Luxury Stay & Destination</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto font-normal"
            >
              Handpicked tourist spots, verified heritage homestays, and AI-curated itineraries across India.
            </motion.p>
          </div>

          {/* Interactive Search Bar Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl p-3 sm:p-4 shadow-card-hover border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
          >
            <div
              onClick={() => openModal("filters")}
              className="md:col-span-4 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer text-left space-y-0.5"
            >
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <HiMapPin className="text-indigo-600" />
                <span>Where to?</span>
              </label>
              <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {searchParams.get("location") || "Search destinations"}
              </p>
            </div>

            <div
              onClick={() => openModal("filters")}
              className="md:col-span-4 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer text-left space-y-0.5"
            >
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <HiCalendar className="text-indigo-600" />
                <span>When?</span>
              </label>
              <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {searchParams.get("checkin") ? `${searchParams.get("checkin")} - ${searchParams.get("checkout") || "Anytime"}` : "Add dates"}
              </p>
            </div>

            <div
              onClick={() => openModal("filters")}
              className="md:col-span-4 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer text-left space-y-0.5"
            >
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <HiUserGroup className="text-indigo-600" />
                <span>Guests</span>
              </label>
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                  {searchParams.get("guests") ? `${searchParams.get("guests")} Guests` : "Add guests"}
                </p>
                <div className="p-2.5 gradient-bg-primary rounded-xl text-white shadow-md hover:scale-105 transition-transform">
                  <IoSearchOutline size={18} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metrics Trust Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-slate-700"
          >
            <div className="flex items-center gap-1.5 text-amber-500">
              <HiStar size={18} />
              <span className="text-slate-800 font-extrabold">4.9/5 Rating</span>
              <span className="text-slate-400 font-normal">(1,200+ Reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <HiShieldCheck size={18} className="text-emerald-500" />
              <span className="text-slate-800">100% Verified Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <HiSparkles size={18} className="text-indigo-600" />
              <span className="text-slate-800">AI Travel Planner Included</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Category Pills Bar */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FaCompass className="text-indigo-600" />
              <span>Explore Categories</span>
            </h2>
            {activeCategory && (
              <button
                onClick={() => setSearchParams({})}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 transition-colors"
              >
                <IoCloseOutline size={16} />
                <span>Reset Category</span>
              </button>
            )}
          </div>

          <motion.div
            className="flex overflow-x-auto pb-3 pt-1 gap-3 scrollbar-none"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories?.map((category) => {
              const isSelected = activeCategory === category._id;
              return (
                <motion.button
                  key={category._id}
                  variants={itemVariants}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    if (newParams.get("category") === category._id) {
                      newParams.delete("category");
                    } else {
                      newParams.set("category", category._id);
                    }
                    setSearchParams(newParams);
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={classNames(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-200 flex-shrink-0 text-xs sm:text-sm font-semibold select-none border",
                    isSelected
                      ? "gradient-bg-primary text-white border-transparent shadow-md shadow-indigo-500/25"
                      : "bg-white text-slate-700 border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 shadow-xs"
                  )}
                >
                  <div className={classNames(
                    "w-7 h-7 rounded-xl flex items-center justify-center transition-colors shrink-0",
                    isSelected ? "bg-white/20 text-white fill-white" : "bg-slate-100 text-slate-600"
                  )}>
                    <IconPickerItem value={category.icon} size={16} color={isSelected ? "#FFFFFF" : "#475569"} />
                  </div>
                  <span>{category.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        {/* Tourist Spots Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
            <h2 className="text-xl font-bold text-slate-900">
              Featured Stays & Destinations
            </h2>
            {touristSpots?.total > 0 && (
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {touristSpots.total} Available
              </span>
            )}
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {touristSpotsIsLoading || touristSpotsIsFetching ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-3.5 space-y-3.5 border border-slate-200/80 shadow-card animate-pulse">
                  <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="h-6 bg-slate-200 rounded-lg w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded-lg w-1/4"></div>
                  </div>
                </div>
              ))
            ) : spots?.length > 0 ? (
              spots.map((touristSpot, index) => (
                <TouristSpotCard key={touristSpot._id} touristSpot={touristSpot} index={index} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200/80">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <FaCompass size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-800">No destinations found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your category filter or searching for another location.
                </p>
                <Button size="sm" intent="outline" onClick={() => setSearchParams({})}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </motion.div>
        </section>

        {/* Pagination Section */}
        {touristSpots?.total > 0 && (
          <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-medium text-slate-500">
              Showing <span className="font-bold text-slate-800">{Math.min((page - 1) * limit + 1, touristSpots.total)}</span>–<span className="font-bold text-slate-800">{Math.min(page * limit, touristSpots.total)}</span> of <span className="font-bold text-slate-800">{touristSpots.total}</span> spots
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                intent="outline"
                disabled={page === 1 || touristSpotsIsFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <HiChevronLeft size={16} />
                <span>Previous</span>
              </Button>

              <span className="text-xs font-bold text-slate-700 px-3">
                Page {page} of {Math.max(1, Math.ceil(touristSpots.total / limit))}
              </span>

              <Button
                size="sm"
                intent="outline"
                disabled={page >= Math.ceil(touristSpots.total / limit) || touristSpotsIsFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                <span>Next</span>
                <HiChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
