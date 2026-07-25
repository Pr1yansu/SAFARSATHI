import React from "react";
import { IoMdMenu } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { FaUserCircle, FaCompass } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
import Menu from "./menu";
import useModal from "../hooks/modal";
import { useProfileQuery } from "../../store/apis/user";
import Loader from "./loader";

const hideHeader = ["/reset-password"];

const Header = () => {
  const { data: profile, isLoading, isFetching } = useProfileQuery();
  const pathname = useLocation().pathname;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const openModal = useModal((state) => state.open);

  if (hideHeader.some((path) => new RegExp(path).test(pathname))) {
    return null;
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <nav className="max-w-7xl mx-auto py-3 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          className="flex items-center gap-2.5 group cursor-pointer"
          to={"/"}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <FaCompass className="text-xl animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:opacity-90 transition-opacity">
              SAFAR<span className="gradient-text">SATHI</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 -mt-1">
              Explore Verified
            </span>
          </div>
        </Link>

        {/* Search Bar Pill */}
        <div
          className="rounded-full bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-indigo-300 flex items-center gap-2 px-3 py-1.5 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 max-md:w-full justify-between"
          onClick={() => {
            openModal("filters");
          }}
        >
          <span className="px-3 font-medium text-xs sm:text-sm text-slate-700">Any Destination</span>
          <span className="h-4 w-[1px] bg-slate-200 max-sm:hidden" />
          <span className="px-3 font-medium text-xs sm:text-sm text-slate-700 max-sm:hidden">Any Time</span>
          <span className="h-4 w-[1px] bg-slate-200 max-sm:hidden" />
          <span className="px-3 text-xs sm:text-sm text-slate-400 max-sm:hidden">Add Guests</span>
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full text-white shadow-sm hover:scale-105 transition-transform">
            <IoSearchOutline size={16} />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* AI Planner Link */}
          <Link
            to="/planner"
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-200/60 hover:border-indigo-400 hover:shadow-sm transition-all duration-200"
          >
            <HiSparkles className="text-indigo-600 text-sm animate-bounce" />
            <span>AI Itinerary</span>
          </Link>

          {/* User Menu Trigger */}
          <div className="relative">
            <button
              className="rounded-full flex items-center gap-2.5 p-1.5 pl-3 border border-slate-200 hover:border-indigo-300 hover:shadow-md bg-white transition-all duration-200 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <IoMdMenu size={18} className="text-slate-600" />
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
              ) : (
                <FaUserCircle size={26} className="text-slate-400" />
              )}
            </button>
            <Menu
              isOpen={isMenuOpen}
              profile={profile}
              setIsMenuOpen={setIsMenuOpen}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

