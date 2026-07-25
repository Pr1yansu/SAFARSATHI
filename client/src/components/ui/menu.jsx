import React, { useEffect } from "react";
import { IoMdLogIn } from "react-icons/io";
import { MdDashboard, MdFavorite, MdOutlineFiberNew, MdAddHomeWork } from "react-icons/md";
import useModal from "../hooks/modal";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { BiHomeAlt2, BiLogOut } from "react-icons/bi";
import { useLogoutMutation } from "../../store/apis/user";

const Menu = ({ isOpen, profile, setIsMenuOpen }) => {
  const [logout] = useLogoutMutation();
  const { pathname } = useLocation();
  const openModal = useModal((state) => state.open);

  useEffect(() => {
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname, setIsMenuOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute right-0 top-full mt-2 w-64 glass-card rounded-2xl shadow-card-hover border border-slate-200/80 z-50 text-nowrap overflow-hidden p-2"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {profile?._id && (
            <div className="p-3 mb-1 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-sm">
                  {profile?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{profile.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{profile.email}</p>
              </div>
            </div>
          )}

          <ul className="text-xs font-semibold text-slate-700 space-y-1">
            <li
              className="hover:bg-indigo-50/80 hover:text-indigo-600 px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
              onClick={() => {
                if (profile?._id) {
                  openModal("profile");
                } else {
                  openModal("register");
                }
              }}
            >
              {profile?._id ? (
                <>
                  <FaUserCircle size={16} className="text-indigo-600" />
                  <span>My Profile</span>
                </>
              ) : (
                <>
                  <MdOutlineFiberNew size={18} className="text-indigo-600" />
                  <span>Sign Up</span>
                </>
              )}
            </li>

            {!profile?._id && (
              <li
                className="hover:bg-indigo-50/80 hover:text-indigo-600 px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                onClick={() => openModal("login")}
              >
                <IoMdLogIn size={18} className="text-indigo-600" />
                <span>Log In</span>
              </li>
            )}

            {profile?.role === "admin" && (
              <li className="hover:bg-indigo-50/80 hover:text-indigo-600 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer">
                <Link to={"/admin/dashboard"} className="flex items-center gap-2.5 w-full">
                  <MdDashboard size={18} className="text-indigo-600" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            )}

            <li
              className="hover:bg-indigo-50/80 hover:text-indigo-600 px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
              onClick={() => {
                if (profile?._id) {
                  openModal("rent");
                } else {
                  openModal("login");
                }
              }}
            >
              <MdAddHomeWork size={18} className="text-indigo-600" />
              <span>List Your Property</span>
            </li>

            {profile && (
              <>
                <li className="hover:bg-indigo-50/80 hover:text-indigo-600 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer">
                  <Link to="/favorites" className="flex items-center gap-2.5 w-full">
                    <MdFavorite size={18} className="text-rose-500" />
                    <span>Saved Favorites</span>
                  </Link>
                </li>

                <li className="hover:bg-indigo-50/80 hover:text-indigo-600 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer">
                  <Link to="/listed" className="flex items-center gap-2.5 w-full">
                    <BiHomeAlt2 size={18} className="text-indigo-600" />
                    <span>My Listed Homes</span>
                  </Link>
                </li>

                <div className="h-[1px] bg-slate-100 my-1" />

                <li className="hover:bg-rose-50 text-rose-600 px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer font-bold">
                  <BiLogOut size={18} />
                  <button
                    onClick={async () => {
                      await logout();
                      window.location.reload();
                    }}
                    className="w-full text-left"
                  >
                    Log Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;

