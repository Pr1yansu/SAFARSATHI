import React, { useEffect } from "react";
import { IoMdLogIn } from "react-icons/io";
import { MdDashboard, MdFavorite, MdOutlineFiberNew } from "react-icons/md";
import { MdAddHomeWork } from "react-icons/md";
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
              <>
                <li className="hover:bg-gray-100 px-4 py-2 duration-150 ">
                  <Link to="/listed" className="flex items-center gap-2">
                    <BiHomeAlt2 size={18} />
                    Listed homes
                  </Link>
                </li>
                <li className="hover:bg-red-500/70 px-4 py-2 duration-150 flex items-center gap-2 bg-red-500 text-white">
                  <BiLogOut size={18} />
                  <button
                    onClick={async () => {
                      await logout();
                      window.location.reload();
                    }}
                  >
                    Logout
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
