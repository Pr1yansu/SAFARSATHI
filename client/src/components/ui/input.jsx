import React from "react";
import { cva } from "class-variance-authority";
import cn from "classnames";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const inputVariants = cva([
  "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50",
]);

const Input = ({ className, ...rest }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative w-full overflow-hidden">
      <input
        className={cn(inputVariants(), className)}
        {...rest}
        onWheel={(e) => e.target.blur()}
        onWheelCapture={(e) => e.target.blur()}
        type={rest.type === "password" && showPassword ? "text" : rest.type}
      />
      {rest.type === "password" && (
        <div className="absolute right-0 top-0 cursor-pointer h-full p-4 flex items-center justify-center">
          {showPassword ? (
            <BsEyeSlash
              size={20}
              onClick={() => {
                setShowPassword(false);
              }}
            />
          ) : (
            <BsEye
              size={20}
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
