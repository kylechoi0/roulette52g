import React from "react";
import { twMerge } from "tailwind-merge";

const variants = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  danger: "bg-red-500 hover:bg-red-600 text-white",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3.5 text-base",
  lg: "px-8 py-6 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  const baseStyle = "font-bold rounded-xl transition-all duration-200";

  return (
    <button
      className={twMerge(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
