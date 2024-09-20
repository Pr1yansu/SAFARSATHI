import classNames from "classnames";
import React from "react";
import { IconPickerItem } from "react-icons-picker";
import { motion } from "framer-motion";

const CategoryPicker = ({ categories, onChange, selectedCategory }) => {
  return (
    <div className="max-h-[480px] overflow-y-auto">
      <h4 className="text-lg font-semibold text-gray-800">
        Which of these best describes your place?
      </h4>
      <p
        className={classNames(
          "text-sm font-semibold text-gray-600",
          "mt-2 mb-4"
        )}
      >
        Pick a category
      </p>
      <div className="grid grid-cols-2 gap-2 my-6">
        {categories &&
          categories.map((category, i) => (
            <motion.div
              key={category._id}
              onClick={() => {
                onChange(category._id);
              }}
              className={classNames(
                "border rounded-md text-gray-600 p-4 hover:bg-gray-100 cursor-pointer duration-200 space-y-2 text-sm font-semibold",
                selectedCategory === category._id && "border-purple-500"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: i * 0.2,
                type: "tween",
                ease: "easeInOut",
              }}
            >
              <div>
                <IconPickerItem value={category.icon} size={24} />
              </div>
              <div>{category.label}</div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default CategoryPicker;
