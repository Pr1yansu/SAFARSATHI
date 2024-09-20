import React, { useEffect } from "react";
import { IoMdLogIn } from "react-icons/io";
import { MdDashboard, MdFavorite, MdOutlineFiberNew } from "react-icons/md";
import { MdAddHomeWork } from "react-icons/md";
import useModal from "../hooks/modal";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { BiHomeAlt2 } from "react-icons/bi";

const Menu = ({ isOpen, profile, setIsMenuOpen }) => {
  const { pathname } = useLocation();
  const openModal = useModal((state) => state.open);

  useEffect(() => {
    if (isOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute shadow-md bg-white rounded-md right-0 -bottom-1 border translate-y-full z-30 text-nowrap overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <ul className="text-sm">
            <li
              className="hover:bg-gray-100 px-4 py-2 duration-150 flex items-center gap-2
        "
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
                  <FaUserCircle size={18} />
                  Profile
                </>
              ) : (
                <>
                  <MdOutlineFiberNew size={18} />
                  Sign up
                </>
              )}
            </li>
            {!profile?._id && (
              <li
                className="hover:bg-gray-100 px-4 py-2 duration-150 flex items-center gap-2"
                onClick={() => openModal("login")}
              >
                <IoMdLogIn size={18} />
                Login
              </li>
            )}
            {profile?.role === "admin" && (
              <li className="hover:bg-gray-100 px-4 py-2 duration-150 flex gap-2">
                {profile?.role === "admin" && (
                  <Link
                    to={"/admin/dashboard"}
                    className="flex items-center gap-2"
                  >
                    <MdDashboard size={18} />
                    Dashboard
                  </Link>
                )}
              </li>
            )}
            <li
              className="hover:bg-gray-100 px-4 py-2 duration-150 flex gap-2"
              onClick={() => {
                if (profile?._id) {
                  openModal("rent");
                } else {
                  openModal("login");
                }
              }}
            >
              <MdAddHomeWork size={18} />
              List your home
            </li>
            {profile && (
              <li className="hover:bg-gray-100 px-4 py-2 duration-150 ">
                <Link to="/favorites" className="flex items-center gap-2">
                  <MdFavorite size={18} />
                  See your favorites
                </Link>
              </li>
            )}
            {profile && (
              <li className="hover:bg-gray-100 px-4 py-2 duration-150 ">
                <Link to="/listed" className="flex items-center gap-2">
                  <BiHomeAlt2 size={18} />
                  Listed homes
                </Link>
              </li>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
