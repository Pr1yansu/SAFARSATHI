import React from "react";
import * as animationData from "../animation/loader.json";
import Lottie from "react-lottie";
import { motion } from "framer-motion";

const Loader = ({ fullScreen = true, text = "Exploring luxury destinations..." }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData.default || animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const loaderCard = (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-xs w-full text-center space-y-3 relative overflow-hidden flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="w-48 h-36 flex items-center justify-center overflow-hidden">
        <Lottie options={defaultOptions} height={140} width={180} />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-black text-slate-800 tracking-tight">
          {text}
        </p>
        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
          Safarsathi Travel Companion
        </p>
      </div>
    </motion.div>
  );

  if (!fullScreen) {
    return <div className="py-12 flex items-center justify-center">{loaderCard}</div>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/20 backdrop-blur-[2px] flex items-center justify-center p-4 pointer-events-none">
      {loaderCard}
    </div>
  );
};

export default Loader;
