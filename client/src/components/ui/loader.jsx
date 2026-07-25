import React from "react";
import { motion } from "framer-motion";
import { FaCompass } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const Loader = ({ fullScreen = true, text = "Curating luxury stays..." }) => {
  const loaderContent = (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl rounded-3xl p-8 max-w-xs w-full text-center space-y-4 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated Glowing Ring */}
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-spin blur-xs opacity-80" style={{ animationDuration: "3s" }}></div>
        <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
          <FaCompass className="text-indigo-600 animate-pulse text-2xl" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-extrabold shadow-xs">
          <HiSparkles className="text-indigo-600" />
          <span>SAFARSATHI</span>
        </div>
        <p className="text-xs font-bold text-slate-700 animate-pulse pt-1">
          {text}
        </p>
      </div>

      {/* Bottom Progress Line */}
      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse w-full"></div>
      </div>
    </motion.div>
  );

  if (!fullScreen) {
    return <div className="py-12 flex items-center justify-center">{loaderContent}</div>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
      {loaderContent}
    </div>
  );
};

export default Loader;
