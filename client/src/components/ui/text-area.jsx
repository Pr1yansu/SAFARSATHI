import React from "react";
import { cva } from "class-variance-authority";
import cn from "classnames";

const inputVariants = cva([
  "flex w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50",
]);

const TextArea = ({ className, ...rest }) => {
  return (
    <textarea
      className={cn(inputVariants(), className)}
      {...rest}
      cols={15}
      rows={5}
    />
  );
};

export default TextArea;
