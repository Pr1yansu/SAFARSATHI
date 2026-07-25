import React, { useState } from "react";
import Input from "../components/ui/input";
import Textarea from "../components/ui/text-area";
import Button from "../components/ui/button";
import { useSendMessageMutation } from "../store/apis/contact";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { HiSparkles, HiPhone, HiEnvelope, HiMapPin, HiClock, HiChatBubbleLeftEllipsis, HiCheckCircle } from "react-icons/hi2";
import { motion } from "framer-motion";

const ContactForm = () => {
  const navigate = useNavigate();
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      })
        .unwrap()
        .then(() => {
          toast.success("Message sent successfully! Our concierge team will reply shortly.");
          setFormData({
            name: "",
            email: "",
            message: "",
          });
          navigate("/");
        })
        .catch((e) => {
          toast.error(e.message || "Failed to send message");
        });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 gradient-hero-bg">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold shadow-xs backdrop-blur-sm"
          >
            <HiSparkles className="text-indigo-600 animate-spin" style={{ animationDuration: "4s" }} />
            <span>24/7 Concierge & Guest Support</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            We'd Love to <span className="gradient-text">Hear From You</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg font-normal"
          >
            Have questions about a luxury stay, listing your property, or AI travel itineraries? Our support team is here to assist.
          </motion.p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Highlights & Help Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-card">
              <h3 className="text-xl font-bold tracking-tight">Direct Contact Channels</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div className="p-3 bg-indigo-600 text-white rounded-xl">
                    <HiPhone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Customer Support Phone</p>
                    <p className="text-sm font-bold text-white">+1 (800) 555-SAFAR</p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Toll-free 24/7 Hotline</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div className="p-3 bg-violet-600 text-white rounded-xl">
                    <HiEnvelope size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Official Concierge Email</p>
                    <p className="text-sm font-bold text-white">support@safarsathi.com</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Average reply time &lt; 15 minutes</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div className="p-3 bg-pink-600 text-white rounded-xl">
                    <HiMapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Headquarters</p>
                    <p className="text-sm font-bold text-white">Mumbai • New Delhi • Bengaluru</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">India Operations Center</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <HiCheckCircle size={16} />
                  <span>Guaranteed Response SLA</span>
                </span>
                <span className="flex items-center gap-1">
                  <HiClock size={16} />
                  <span>24/7 Available</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Glass Contact Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card-hover border border-slate-200/80 space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <HiChatBubbleLeftEllipsis className="text-indigo-600" />
                  <span>Send Us a Message</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Fill out the details below and a concierge specialist will reach out to you directly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Your Full Name</label>
                  <Input
                    name="name"
                    placeholder="e.g. Priyanshu Chowdhury"
                    value={formData.name}
                    onChange={handleChange}
                    className="!p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="!p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">How Can We Help?</label>
                  <Textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your inquiry, booking details, or host partnership request..."
                    value={formData.message}
                    onChange={handleChange}
                    className="!p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  intent="primary"
                  className="w-full font-bold shadow-glow py-3.5 rounded-2xl flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <BiLoaderCircle size={20} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    "Send Message to Support"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

