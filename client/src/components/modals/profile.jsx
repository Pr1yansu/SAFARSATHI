import React, { useEffect } from "react";
import { useProfileQuery } from "../../store/apis/user";
import Loader from "../ui/loader";
import { motion, AnimatePresence } from "framer-motion";
import useModal from "../hooks/modal";
import Label from "../ui/label";
import Input from "../ui/input";
import { AiOutlineUser } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import Button from "../ui/button";

const ProfileModal = () => {
  const { data: profile, isLoading, isFetching } = useProfileQuery();
  const { close: closeModal, isOpen: isModalOpen, variant } = useModal();
  const [data, setData] = React.useState({
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

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!isModalOpen) {
    return null;
  }

  if (variant !== "profile") {
    return null;
  }

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={closeModal}
        >
          <motion.div
            className="bg-white rounded-md p-4 shadow-md max-w-md w-full mx-6 relative space-y-2"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute p-1 top-2 right-2"
              size="icon"
              intent="ghost"
              onClick={closeModal}
            >
              <RxCross1 size={20} />
            </Button>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-baseline gap-6">
              Edit Profile
              <div className="text-sm text-gray-500">{profile.role}</div>
            </h4>
            <div className="flex items-center justify-between flex-wrap">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full my-4"
                />
              ) : (
                <AiOutlineUser size={100} className="text-purple-500 my-4" />
              )}
              <div className="space-y-2">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  multiple={false}
                  className="w-full"
                  onChange={(e) => setData({ ...data, avatar: e.target.value })}
                />
                <p className="text-sm text-gray-500">
                  JPG, PNG, GIF up to 10MB
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className={"w-full space-y-2"}>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
              <div className={"w-full space-y-2"}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
            </div>
            <Button
              size="sm"
              intent="outline"
              className="rounded-md ms-auto my-4"
            >
              Save Changes
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
