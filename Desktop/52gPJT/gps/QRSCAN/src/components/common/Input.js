import React from "react";
import { twMerge } from "tailwind-merge";

const Input = React.forwardRef(({ className, error, ...props }, ref) => {
  const baseStyle =
    "w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const errorStyle = "border-red-500 focus:ring-red-500";

  return (
    <div className="w-full">
      <input
        ref={ref}
        className={twMerge(baseStyle, error && errorStyle, className)}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Input;
