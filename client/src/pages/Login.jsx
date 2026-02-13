import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiMail, HiLockClosed, HiExclamationCircle, HiArrowRight } from "react-icons/hi";

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
    <div className="min-h-screen flex items-center justify-center relative bg-black">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="absolute inset-0 opacity-[0.02]" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
             backgroundSize: '40px 40px'
           }} 
      />
      
      {/* Subtle Green Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent)]/3 rounded-full blur-3xl" />

      {/* Main Login Container */}
      <div className="w-full max-w-md px-6">
        {/* Brand Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-accent)] rounded-2xl mb-6 shadow-lg shadow-[var(--color-accent)]/20">
            <span className="text-black font-bold text-2xl tracking-tight">HT</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to access your clan heritage
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-2xl mb-6 flex items-start gap-3">
              <HiExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <HiMail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full bg-black/40 border border-gray-700/50 text-white placeholder-gray-500 rounded-2xl px-4 py-4 text-sm
                         focus:border-[var(--color-accent)]/50 focus:ring-2 focus:ring-[var(--color-accent)]/10 focus:outline-none 
                         transition-all duration-200 hover:border-gray-600/50"
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <HiLockClosed className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full bg-black/40 border border-gray-700/50 text-white placeholder-gray-500 rounded-2xl px-4 py-4 text-sm
                         focus:border-[var(--color-accent)]/50 focus:ring-2 focus:ring-[var(--color-accent)]/10 focus:outline-none 
                         transition-all duration-200 hover:border-gray-600/50"
                autoComplete="current-password"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-accent)] text-black font-semibold py-4 rounded-2xl
                       hover:bg-[var(--color-accent)]/90 hover:shadow-lg hover:shadow-[var(--color-accent)]/25
                       active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Continue
                  <HiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
            <p className="text-gray-500 text-xs">
              Connecting generations • Preserving legacy
            </p>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default Login;
