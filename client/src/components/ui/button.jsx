import React from "react";
import cn from "classnames";
import { cva } from "class-variance-authority";
import { FaGoogle, FaGithub } from "react-icons/fa";
const buttonVariants = cva(["duration-150 border"], {
  variants: {
    intent: {
      primary: [
        "bg-purple-500",
        "text-white",
        "hover:bg-purple-600",
        "border-transparent",
      ],
      secondary: [
        "bg-gray-200",
        "text-gray-800",
        "hover:bg-gray-300",
        "border-transparent",
      ],
      outline: [
        "bg-transparent",
        "text-purple-500",
        "hover:bg-purple-50",
        "border-purple-500",
      ],
      danger: [
        "bg-red-500",
        "text-white",
        "hover:bg-red-600",
        "border-transparent",
      ],
      ghost: [
        "bg-transparent",
        "text-gray-800",
        "hover:bg-gray-100",
        "border-transparent",
      ],
      google: [
        "bg-white",
        "text-gray-800",
        "hover:bg-gray-100",
        "border-gray-200",
        "flex items-center justify-center gap-2",
      ],
      github: [
        "bg-black",
        "text-white",
        "hover:bg-gray-800",
        "border-transparent",
        "flex items-center justify-center gap-2",
      ],
    },
    size: {
      sm: ["px-3", "py-2", "text-sm"],
      md: ["px-4", "py-2", "text-base"],
      lg: ["px-6", "py-3", "text-lg"],
      icon: ["p-2", "rounded-full", "text-lg", "hover:bg-gray-200"],
    },
  },
  compoundVariants: [
    {
      intent: "primary",
      size: "md",
    },
  ],
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

const Button = ({
  children,
  className,
  intent = "primary",
  size = "md",
  ...props
}) => {
  return (
    <button
      className={cn(
        buttonVariants({ intent, size }),
        "rounded-full flex items-center justify-center disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {intent === "google" && <FaGoogle className="text-red-500" />}
      {intent === "github" && <FaGithub />}
    </button>
  );
};

export default Button;
