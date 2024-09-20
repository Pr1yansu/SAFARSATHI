import React from "react";
import cn from "classnames";

const Separator = ({
  direction = "horizontal",
  thickness = "1px",
  color = "#e0e0e0",
  length = "100%",
  className,
}) => {
  const separatorClass = cn(
    {
      "bg-gray-300": true,
      "h-full w-[1px]": direction === "vertical",
      "w-full h-[1px]": direction === "horizontal",
    },
    className
  );

  const style = {
    backgroundColor: color,
    width: direction === "horizontal" ? length : thickness,
    height: direction === "vertical" ? length : thickness,
  };

  return <div className={separatorClass} style={style} />;
};

export default Separator;
