import React from "react";
import cn from "classnames";
import { cva } from "class-variance-authority";
import { FaGoogle, FaGithub } from "react-icons/fa";

const buttonVariants = cva(
  ["transition-all duration-200 font-medium active:scale-95 disabled:pointer-events-none disabled:opacity-50"],
  {
    variants: {
      intent: {
        primary: [
          "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md hover:shadow-lg hover:shadow-indigo-500/25 border-transparent",
        ],
        secondary: [
          "bg-slate-100 text-slate-800 hover:bg-slate-200 border-transparent",
        ],
        outline: [
          "bg-white/80 backdrop-blur-sm text-indigo-600 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 shadow-xs",
        ],
        danger: [
          "bg-rose-500 text-white hover:bg-rose-600 shadow-md hover:shadow-rose-500/25 border-transparent",
        ],
        ghost: [
          "bg-transparent text-slate-700 hover:bg-slate-100/80 border-transparent",
        ],
        google: [
          "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-xs flex items-center justify-center gap-2",
        ],
        github: [
          "bg-slate-900 text-white hover:bg-slate-800 border-transparent shadow-xs flex items-center justify-center gap-2",
        ],
      },
      size: {
        sm: ["px-3.5", "py-1.5", "text-xs", "rounded-lg"],
        md: ["px-5", "py-2.5", "text-sm", "rounded-xl"],
        lg: ["px-7", "py-3.5", "text-base", "rounded-2xl"],
        icon: ["p-2.5", "rounded-xl", "text-lg", "hover:bg-slate-100"],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

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
        "flex items-center justify-center gap-2 cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {children}
      {intent === "google" && <FaGoogle className="text-rose-500 text-base" />}
      {intent === "github" && <FaGithub className="text-white text-base" />}
    </button>
  );
};

export default Button;

