import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 page-enter">
        {children}
      </main>
      <footer className="bg-white/50 backdrop-blur-sm mt-16 py-8 border-t border-[var(--color-border)]/50">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] rounded-md flex items-center justify-center text-white text-[10px] font-bold">
              HT
            </div>
            <span className="text-sm font-semibold text-[var(--color-text)]">Haikambe Tsame</span>
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            &copy; {new Date().getFullYear()} Haikambe Tsame Clan Digital Archive. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
