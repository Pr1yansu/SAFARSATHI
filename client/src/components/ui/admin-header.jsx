import React from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";
import { FaHome } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { MdCategory } from "react-icons/md";
import { BiHomeCircle } from "react-icons/bi";

const Links = [
  { name: "Home", link: "/", icon: FaHome },
  { name: "Dashboard", link: "/admin/dashboard", icon: RxDashboard },
  { name: "Users", link: "/admin/dashboard/users", icon: FaUsers },
  { name: "Settings", link: "/settings", icon: IoSettingsOutline },
  { name: "Categories", link: "/admin/dashboard/categories", icon: MdCategory },
  { name: "All Listed Homes", link: "/admin/listed/all", icon: BiHomeCircle },
];

const AdminHeader = () => {
  const { pathname } = useLocation();
  const [show, setShow] = React.useState(false);
  const [animationComplete, setAnimationComplete] = React.useState(false);

  return (
    <div
      className="fixed lg:right-20 md:right-10 sm:right-5 right-2 z-20 lg:mx-4 md:mx-2 sm:mx-1 mx-0"
      onClick={() => setShow(!show)}
    >
      <div className="relative">
        <div className="bg-white shadow-md rounded-full border cursor-pointer p-2 my-2">
          <MdDashboardCustomize size={20} />
        </div>
        <AnimatePresence>
          {show && (
            <motion.ul
              className="absolute bg-white shadow-md border rounded-md right-0 text-sm overflow-hidden"
              initial={{ opacity: 0, height: 0, width: 0 }}
              animate={{ opacity: 1, height: "auto", width: "auto" }}
              exit={{ opacity: 0, height: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              onAnimationComplete={() => setAnimationComplete(true)}
            >
              {animationComplete &&
                Links.map((link, index) => (
                  <motion.li
                    key={index}
                    className={classNames(
                      "p-2 px-4 hover:bg-gray-100 cursor-pointer",
                      pathname === link.link && "bg-gray-100 text-violet-500"
                    )}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div whileHover={{ x: 10 }}>
                      <NavLink
                        to={link.link}
                        className={classNames(
                          "flex items-center gap-2",
                          pathname === link.link && "text-violet-500"
                        )}
                      >
                        <link.icon size={18} />
                        <span className="text-gray-800 text-nowrap">
                          {link.name}
                        </span>
                      </NavLink>
                    </motion.div>
                  </motion.li>
                ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminHeader;
