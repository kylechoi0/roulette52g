import React from "react";
import { FaTimes } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "default",
  className,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    default: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-7xl",
    full: "w-full h-full",
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div
          className={twMerge(
            "relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 w-full",
            sizes[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3
                className="text-2xl font-semibold text-gray-900"
                id="modal-title"
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Close</span>
                <FaTimes className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="p-4 sm:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
