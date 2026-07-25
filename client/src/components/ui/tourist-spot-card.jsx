import { BiHeart } from "react-icons/bi";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/utils";
import { addLike, removeLike } from "../../store/slices/like-spots";
import { useProfileQuery } from "../../store/apis/user";
import toast from "react-hot-toast";
import { LuShare2 } from "react-icons/lu";
import { MdVerified } from "react-icons/md";
import classNames from "classnames";
import { useState } from "react";
import { useSendVerificationRequestToAdminsMutation } from "../../store/apis/touristspots";

const TouristSpotCard = ({
  touristSpot,
  index,
  shareIcon = false,
  requestVerification = false,
}) => {
  const dispatch = useDispatch();
  const [sendVerificationRequestToAdmins] =
    useSendVerificationRequestToAdminsMutation();
  const { data: profile, isLoading, isFetching } = useProfileQuery();
  const likedSpots = useSelector((state) => state.likedSpots.likedSpots);

  const [tooltip, setTooltip] = useState("");

  if (isLoading || isFetching) {
    return null;
  }

  const isLiked = likedSpots.includes(touristSpot._id);

  const handleLikeToggle = (e) => {
    toast.dismiss();
    e.stopPropagation();
    e.preventDefault();
    if (!profile) {
      toast.error("Please login to like a spot");
      return;
    }
    if (isLiked) {
      dispatch(removeLike(touristSpot._id));
    } else {
      dispatch(addLike(touristSpot._id));
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(
      `${window.location.origin}/tourist-spot/${touristSpot._id}`
    );
    if (navigator.share) {
      navigator.share({
        title: touristSpot.name,
        text: touristSpot.description,
        url: `${window.location.origin}/tourist-spot/${touristSpot._id}`,
      }).catch(() => {});
    }
    toast.success("Link copied to clipboard");
  };

  const handleMouseEnter = () => {
    setTooltip(touristSpot.verified ? "Verified Spot" : "Request Verification");
  };

  return (
    <Link to={`/tourist-spot/${touristSpot._id}`} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 flex flex-col h-full"
      >
        {/* Image & Overlay Badge */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={touristSpot.image?.secure_url}
            alt={touristSpot.name}
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
            draggable={false}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

          {/* Category Badge */}
          {touristSpot.category?.label && (
            <div className="absolute top-3 left-3 z-10 glass-badge px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-xs">
              {touristSpot.category.label}
            </div>
          )}

          {/* Heart Button */}
          <button
            className="absolute top-3 right-3 z-10 p-2.5 glass-badge hover:bg-white rounded-full text-slate-700 transition-all duration-200 shadow-xs active:scale-90"
            onClick={handleLikeToggle}
            aria-label="Favorite"
          >
            {isLiked ? (
              <FaHeart className="text-rose-500 text-base animate-pulse" />
            ) : (
              <BiHeart className="text-slate-600 hover:text-rose-500 text-base transition-colors" />
            )}
          </button>

          {/* Location pill overlay */}
          {touristSpot.location?.address && (
            <div className="absolute bottom-3 left-3 z-10 text-white font-medium text-xs flex items-center gap-1.5 drop-shadow-md">
              <FaMapMarkerAlt className="text-rose-400 text-xs" />
              <span className="line-clamp-1">{touristSpot.location.address}</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {touristSpot.name}
              </h3>

              {/* Verified Icon */}
              {touristSpot.verified && (
                <MdVerified
                  className="text-emerald-500 text-lg flex-shrink-0"
                  title="Verified Destination"
                />
              )}
            </div>

            {touristSpot.address && (
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {touristSpot.address}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">
                {formatCurrency(touristSpot.price)}
              </span>
              <span className="text-xs font-medium text-slate-400">/ night</span>
            </div>

            <div className="flex items-center gap-2">
              {shareIcon && (
                <button
                  onClick={handleShare}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                  title="Share"
                >
                  <LuShare2 size={16} />
                </button>
              )}

              {requestVerification && (
                <div className="relative">
                  <button
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => setTooltip("")}
                    onClick={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toast.dismiss();
                      if (!profile) {
                        toast.error("Please login to request verification");
                        return;
                      }
                      if (touristSpot.verified) {
                        toast.error("This spot is already verified");
                        return;
                      }
                      try {
                        await sendVerificationRequestToAdmins(touristSpot._id).unwrap();
                        toast.success("Verification request sent");
                      } catch (error) {
                        toast.error("An error occurred");
                      }
                    }}
                    className={classNames(
                      "p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1",
                      touristSpot.verified
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-amber-600 bg-amber-50 hover:bg-amber-100"
                    )}
                  >
                    <MdVerified size={16} />
                    <span>{touristSpot.verified ? "Verified" : "Verify"}</span>
                  </button>
                  {tooltip && (
                    <div className="absolute right-0 bottom-full mb-1 z-20 bg-slate-900 text-white text-[10px] rounded-md px-2 py-1 whitespace-nowrap shadow-lg">
                      {tooltip}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default TouristSpotCard;

