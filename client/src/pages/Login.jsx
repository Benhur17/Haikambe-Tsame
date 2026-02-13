import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiMail, HiLockClosed, HiExclamationCircle, HiLogin } from "react-icons/hi";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(formData);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111827] to-[#0d0d0d]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--color-accent)] blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[var(--color-info)] blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full bg-purple-500 blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Login Card */}
      <div className="relative w-full max-w-md scale-in">
        <div className="bg-white/[0.08] backdrop-blur-2xl rounded-3xl border border-white/[0.12] p-8 sm:p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-5 shadow-lg shadow-[var(--color-accent)]/30 rotate-3 hover:rotate-0 transition-transform">
              HT
            </div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
              Haikambe Tsame
            </h1>
            <p className="text-white/50 text-sm">Clan Digital Archive</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 fade-in">
              <HiExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
                <HiMail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/30 rounded-xl px-4 py-3.5 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:outline-none transition-all"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
                <HiLockClosed className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/30 rounded-xl px-4 py-3.5 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:outline-none transition-all"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] shadow-lg shadow-[var(--color-accent)]/25 hover:shadow-xl hover:shadow-[var(--color-accent)]/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <HiLogin className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-xs text-white/30">
              Preserve your heritage. Connect your lineage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
