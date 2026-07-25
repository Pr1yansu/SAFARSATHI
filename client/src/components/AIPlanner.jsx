import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { HiSparkles, HiMapPin, HiCalendar, HiCurrencyRupee, HiHeart } from "react-icons/hi2";
import Button from "./ui/button";

const AIPlanner = () => {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "moderate",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setItinerary("");
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v1/ai/itinerary`,
        formData
      );
      setItinerary(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong generating your trip itinerary."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 gradient-hero-bg">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <HiSparkles className="text-indigo-600 animate-bounce" />
            <span>Powered by Gemini AI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Personalized <span className="gradient-text">AI Trip Planner</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Tell us where you want to go and your vibe — our AI will curate a custom day-by-day travel plan instantly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <HiMapPin className="text-indigo-600" />
                <span>Destination</span>
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g., Manali, Goa, Jaipur"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all shadow-xs"
                required
              />
            </div>

            {/* Days */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <HiCalendar className="text-indigo-600" />
                <span>Number of Days</span>
              </label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleChange}
                placeholder="e.g., 3"
                min="1"
                max="30"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all shadow-xs"
                required
              />
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <HiCurrencyRupee className="text-indigo-600" />
                <span>Travel Style & Budget</span>
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all shadow-xs"
              >
                <option value="budget-friendly">Backpacker / Budget-Friendly</option>
                <option value="moderate">Comfort / Moderate</option>
                <option value="luxury">Luxury / Premium Stay</option>
              </select>
            </div>

            {/* Interests */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <HiHeart className="text-indigo-600" />
                <span>Interests & Vibes</span>
              </label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g., food, photography, trekking"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            intent="primary"
            disabled={loading}
            className="w-full font-bold shadow-glow"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <HiSparkles className="animate-spin" />
                Crafting Your Custom Itinerary...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <HiSparkles />
                Generate AI Itinerary
              </span>
            )}
          </Button>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-600 font-semibold text-center">
            {error}
          </div>
        )}

        {/* Generated Itinerary Output */}
        {itinerary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 sm:p-8 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HiSparkles className="text-indigo-600" />
                <span>Your Curated Itinerary</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                AI Ready
              </span>
            </div>

            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
              <ReactMarkdown>{itinerary}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIPlanner;

