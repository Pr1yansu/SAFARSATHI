import React from "react";
import { cva } from "class-variance-authority";
import cn from "classnames";

const inputVariants = cva([
  "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50",
]);

const Input = ({ className, ...rest }) => {
  return (
    <input
      className={cn(inputVariants(), className)}
      {...rest}
      onWheel={(e) => e.target.blur()}
      onWheelCapture={(e) => e.target.blur()}
    />
  );
};

export default Input;
