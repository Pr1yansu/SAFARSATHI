import React, { useEffect, useState } from "react";
import useModal from "../hooks/modal";
import { AnimatePresence, motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { HiEnvelope, HiLockClosed, HiUser, HiEye, HiEyeSlash, HiSparkles } from "react-icons/hi2";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useLoginMutation, useRegisterMutation } from "../../store/apis/user";
import { toast } from "react-hot-toast";

const getBackendUrl = () => {
  if (process.env.REACT_APP_BACKEND_URL) return process.env.REACT_APP_BACKEND_URL;
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000";
  }
  return "https://safarsathi-backend.onrender.com";
};

const Auth = () => {
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const { isOpen, variant, close, open } = useModal();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ email: "", password: "", name: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      setLoading(true);
      if (variant === "login") {
        const { data, error } = await login({
          email: user.email,
          password: user.password,
        });
        if (error) {
          toast.error(typeof error === "string" ? error : error?.data?.message || "Invalid credentials");
          return;
        }
        if (data) {
          toast.success("Welcome back! Logged in successfully");
          close();
        }
      }
      if (variant === "register") {
        const { data, error } = await register({
          email: user.email,
          password: user.password,
          name: user.name,
        });
        if (error) {
          toast.error(typeof error === "string" ? error : error?.data?.message || "Registration failed");
          return;
        }
        if (data) {
          toast.success("Account created! Please log in");
          open("login");
        }
      }
    } catch (error) {
      toast.error(variant === "login" ? "Failed to login" : "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser({ email: "", password: "", name: "" });
    setShowPassword(false);
  }, [variant, isOpen]);

  const handleGoogle = () => {
    window.open(`${getBackendUrl()}/api/v1/users/auth/google`, "_self");
  };

  const handleGithub = () => {
    window.open(`${getBackendUrl()}/api/v1/users/auth/github`, "_self");
  };

  if (variant !== "login" && variant !== "register") return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-md z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-md p-6 sm:p-8 relative overflow-hidden space-y-6"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              disabled={loading}
              onClick={close}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-10"
            >
              <IoCloseOutline size={20} />
            </button>

            {/* Header Badge & Title */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shadow-xs">
                <HiSparkles className="text-indigo-600" />
                <span>Safarsathi Account</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {variant === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                {variant === "login"
                  ? "Enter your credentials to access your luxury stays"
                  : "Join Safarsathi to explore handpicked destinations"}
              </p>
            </div>

            {/* Form Component */}
            <form className="space-y-4" onSubmit={onSubmit}>
              {variant === "register" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <div className="relative flex items-center">
                    <HiUser className="absolute left-3.5 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Priyansu Chowdhury"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative flex items-center">
                  <HiEnvelope className="absolute left-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  {variant === "login" && (
                    <button
                      type="button"
                      onClick={() => open("forgotPassword")}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <HiLockClosed className="absolute left-3.5 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 gradient-bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>{variant === "login" ? "Sign In to Account" : "Create Account"}</span>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider absolute">
                Or continue with
              </span>
            </div>

            {/* Social OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogle}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                <FaGoogle className="text-rose-500" size={16} />
                <span>Google</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleGithub}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                <FaGithub size={16} />
                <span>GitHub</span>
              </button>
            </div>

            {/* Toggle Login/Register Footer */}
            <div className="text-center pt-1 border-t border-slate-100">
              {variant === "login" ? (
                <p className="text-xs text-slate-500 font-medium">
                  Don't have an account?{" "}
                  <button
                    disabled={loading}
                    type="button"
                    onClick={() => open("register")}
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Sign up now
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500 font-medium">
                  Already have an account?{" "}
                  <button
                    disabled={loading}
                    type="button"
                    onClick={() => open("login")}
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Auth;

