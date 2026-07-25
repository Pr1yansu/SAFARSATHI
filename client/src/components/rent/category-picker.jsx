import classNames from "classnames";
import React from "react";
import { IconPickerItem } from "react-icons-picker";
import { motion } from "framer-motion";
import { HiCheckCircle } from "react-icons/hi2";

const CategoryPicker = ({ categories, onChange, selectedCategory }) => {
  return (
    <div className="max-h-[440px] overflow-y-auto scrollbar-none pr-1 space-y-4">
      <div className="space-y-1">
        <h4 className="text-xl font-black text-slate-900 tracking-tight">
          Which of these best describes your place?
        </h4>
        <p className="text-xs font-semibold text-slate-500">
          Pick a primary category so guests can discover your listing
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        {categories &&
          categories.map((category, i) => {
            const isSelected = selectedCategory === category._id;
            return (
              <motion.div
                key={category._id}
                onClick={() => onChange(category._id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={classNames(
                  "relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between space-y-3 select-none",
                  isSelected
                    ? "bg-indigo-50/80 border-indigo-600 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20"
                    : "bg-white border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 shadow-xs"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                {isSelected && (
                  <HiCheckCircle className="absolute top-2.5 right-2.5 text-indigo-600" size={20} />
                )}
                <div
                  className={classNames(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isSelected ? "gradient-bg-primary text-white" : "bg-slate-100 text-slate-700"
                  )}
                >
                  <IconPickerItem value={category.icon} size={20} color={isSelected ? "#FFFFFF" : "#334155"} />
                </div>
                <div>
                  <p className={classNames("text-xs sm:text-sm font-bold", isSelected ? "text-indigo-900" : "text-slate-800")}>
                    {category.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryPicker;
