import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  HiHome, 
  HiUsers, 
  HiViewGrid, 
  HiBookOpen, 
  HiPhotograph, 
  HiCalendar, 
  HiUserAdd,
  HiLogout,
  HiMenu,
  HiX
} from "react-icons/hi";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Dashboard", icon: HiHome },
    { path: "/members", label: "Members", icon: HiUsers },
    { path: "/family-tree", label: "Family Tree", icon: HiViewGrid },
    { path: "/history", label: "History", icon: HiBookOpen },
    { path: "/media", label: "Media", icon: HiPhotograph },
    { path: "/events", label: "Events", icon: HiCalendar },
  ];

  if (user?.role !== "Viewer") {
    navLinks.push({ path: "/newborn-requests", label: "Newborn", icon: HiUserAdd });
  }

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[var(--color-border)]/50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-[var(--color-accent)]/20 group-hover:shadow-lg group-hover:shadow-[var(--color-accent)]/30 transition-all group-hover:scale-105">
              HT
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-[var(--color-text)] tracking-tight">
                Haikambe Tsame
              </h1>
              <p className="text-[10px] text-[var(--color-text-tertiary)] -mt-0.5 uppercase tracking-widest font-medium">Clan Archive</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${active ? "active" : ""}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {active && <span className="nav-indicator" />}
                </Link>
              );
            })}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[var(--color-border-light)]/80">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white text-xs font-bold">
                {user?.fullName?.charAt(0)}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[var(--color-text)] leading-tight">{user?.fullName}</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)] font-medium">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="icon-btn hover:bg-red-50 hover:text-[var(--color-error)] transition-colors"
              title="Logout"
            >
              <HiLogout className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden icon-btn"
          >
            {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--color-border)] py-4 space-y-1 fade-in">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-nav-link ${isActive(link.path) ? "active" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
              <div className="px-4 py-3 rounded-lg bg-[var(--color-surface-elevated)] mb-3">
                <p className="text-sm font-semibold text-[var(--color-text)]">{user?.fullName}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-[var(--color-error)] hover:bg-red-50 rounded-lg transition-colors"
              >
                <HiLogout className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-secondary);
          font-weight: 500;
          font-size: 0.8125rem;
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
          position: relative;
        }
        
        .nav-link:hover {
          color: var(--color-text);
          background-color: var(--color-border-light);
        }
        
        .nav-link.active {
          color: var(--color-accent);
          background-color: var(--color-accent-light);
          font-weight: 600;
        }
        
        .nav-indicator {
          position: absolute;
          bottom: -0.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background: var(--color-accent);
          border-radius: 9999px;
        }
        
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 500;
          padding: 0.875rem 1rem;
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }
        
        .mobile-nav-link:hover {
          color: var(--color-text);
          background-color: var(--color-border-light);
        }
        
        .mobile-nav-link.active {
          color: var(--color-accent);
          background-color: var(--color-accent-light);
          font-weight: 600;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
