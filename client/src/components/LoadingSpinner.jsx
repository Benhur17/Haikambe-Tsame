import React from "react";
import { HiRefresh } from "react-icons/hi";

const LoadingSpinner = ({ size = "md", fullScreen = false, message = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-10 h-10",
    lg: "w-14 h-14"
  };

  const spinner = (
    <div className="relative">
      <div className={`${sizeClasses[size]} border-4 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin`}></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center fade-in">
          {spinner}
          <p className="mt-6 text-[var(--color-text-secondary)] font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
