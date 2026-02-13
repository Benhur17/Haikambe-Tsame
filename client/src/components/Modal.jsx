import React, { useEffect } from "react";
import { HiX } from "react-icons/hi";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity fade-in"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className={`relative bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden scale-in`}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="icon-btn hover:bg-red-50 hover:text-[var(--color-error)]"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 5rem)' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
