import React from "react";
import { motion } from "framer-motion";
import { BiLoaderCircle } from "react-icons/bi";

const InfiniteLoader = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <BiLoaderCircle className="text-2xl animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading more...</p>
      </motion.div>
    </div>
  );
};

export default InfiniteLoader;
