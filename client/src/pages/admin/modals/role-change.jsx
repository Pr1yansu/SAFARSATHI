import React from "react";
import { motion } from "framer-motion";
import useModal from "../../../components/hooks/modal";
import Button from "../../../components/ui/button";
import { useUpdateUserRoleMutation } from "../../../store/apis/user";

const RoleChangeConfirmation = ({ data }) => {
  const { close } = useModal();
  const [updateUserRole] = useUpdateUserRoleMutation({
    id: data?.user?._id,
  });

  const handleUpdate = async () => {
    try {
      await updateUserRole({ role: data?.role });
      close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white p-6 w-full max-w-md rounded-lg shadow-xl"
      >
        <h4 className="text-lg font-bold text-gray-800 mb-4">
          Change Role Confirmation
        </h4>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to change the role of{" "}
          <span className="font-semibold text-gray-800">
            {data?.user?.name || "this user"}
          </span>{" "}
          to <span className="font-semibold text-gray-800">{data?.role}</span>?
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={close}
            className="rounded-md hover:bg-gray-200 transition-colors duration-200"
            intent="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            className="ml-2 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200"
            onClick={handleUpdate}
            intent="danger"
            size="sm"
          >
            Confirm
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleChangeConfirmation;
