import React from "react";
import cn from "classnames";

const Label = ({ hidden, children, className, ...props }) => {
  if (hidden) return;
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
