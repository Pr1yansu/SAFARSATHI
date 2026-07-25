import { CiFacebook, CiInstagram, CiYoutube } from "react-icons/ci";
import Button from "../ui/button";
import { FaXTwitter, FaCompass } from "react-icons/fa6";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSubscribeMutation } from "../../store/apis/news-letter";
import React from "react";
import toast from "react-hot-toast";

export default function Footer() {
  const [subscribe] = useSubscribeMutation();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    try {
      setLoading(true);
      await subscribe({ email })
        .unwrap()
        .then(() => {
          toast.success("Thank you for subscribing to SAFARSATHI");
          setEmail("");
        })
        .catch((e) => {
          toast.error(e);
        });
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <FaCompass className="text-lg animate-pulse" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SAFAR<span className="text-indigo-400">SATHI</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              India's premier travel companion. Discover, compare, and book verified tourist spots, heritage stays, and tailored AI itineraries.
            </p>
            <div className="flex space-x-3 pt-2">
              {[
                { icon: <CiFacebook size={20} />, href: "https://www.facebook.com/" },
                { icon: <FaXTwitter size={18} />, href: "https://x.com" },
                { icon: <CiInstagram size={20} />, href: "https://www.instagram.com/" },
                { icon: <CiYoutube size={20} />, href: "https://www.youtube.com" },
              ].map(({ icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs border border-slate-800"
                  target="_blank"
                  rel="noreferrer"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Featured Spots
                </Link>
              </li>
              <li>
                <Link to="/planner" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>AI Trip Planner</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-semibold">New</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stay Updated</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Subscribe for exclusive travel deals, verified spot additions, and seasonal guides.
            </p>
            <form className="flex gap-2 pt-1" onSubmit={onSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Button
                type="submit"
                size="sm"
                intent="primary"
                disabled={loading}
              >
                <span>Subscribe</span>
                <BsArrowRight size={16} />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SAFARSATHI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

