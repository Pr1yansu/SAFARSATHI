import React from "react";
import { IoMdMenu } from "react-icons/io";
import { IoLogOut, IoSearchOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "./button";
import Separator from "./separator";
import Menu from "./menu";
import useModal from "../hooks/modal";
import { useProfileQuery } from "../../store/apis/user";
import Loader from "./loader";

const Header = () => {
  const { data: profile, isLoading, isFetching } = useProfileQuery();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const openModal = useModal((state) => state.open);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <>
      <nav className="container mx-auto py-4 px-2 flex items-center justify-between gap-4">
        <Link
          className="flex gap-2 items-center cursor-pointer max-md:hidden"
          to={"/"}
        >
          <img src="/logo.svg" alt="logo" className="w-full h-6" />
        </Link>
        <div
          className="rounded-full flex gap-4 p-2 items-center border cursor-pointer hover:shadow-md duration-300 text-sm max-md:w-full justify-between"
          onClick={() => {
            openModal("filters");
          }}
        >
          <div className="px-4 font-semibold">Anywhere</div>
          <Separator
            direction="vertical"
            length="1.5rem"
            className="max-sm:hidden"
          />
          <div className="px-4 font-semibold max-sm:hidden">Any week</div>
          <Separator
            direction="vertical"
            length="1.5rem"
            className="max-sm:hidden"
          />
          <div className="items-center max-sm:hidden">Add guests</div>
          <IoSearchOutline
            size={18}
            className="p-2 h-8 w-8 bg-purple-500 rounded-full text-white"
          />
        </div>
        <div className="flex gap-4">
          {profile?._id ? (
            <div
              className="rounded-full flex gap-2 p-2 px-4 items-center border cursor-pointer hover:shadow-md duration-300 relative max-sm:px-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaUserCircle size={22} className="max-sm:hidden" />

              <IoLogOut size={18} />
              <Menu
                isOpen={isMenuOpen}
                profile={profile}
                setIsMenuOpen={setIsMenuOpen}
              />
            </div>
          ) : (
            <div
              className="rounded-full flex gap-2 p-2 px-4 items-center border cursor-pointer hover:shadow-md duration-300 relative max-sm:px-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <IoMdMenu size={18} />
              <FaUserCircle size={22} className="max-sm:hidden" />
              <Menu isOpen={isMenuOpen} />
            </div>
          )}
        </div>
      </nav>
      <Separator />
    </>
  );
};

export default Header;
