import { BiHeart } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/utils";
import { addLike, removeLike } from "../../store/slices/like-spots";
import { useProfileQuery } from "../../store/apis/user";
import toast from "react-hot-toast";
import { LuShare2 } from "react-icons/lu";
import { MdDomainVerification } from "react-icons/md";
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

  const handleLikeToggle = (e) => {
    toast.dismiss();
    e.stopPropagation();
    e.preventDefault();
    if (!profile) {
      toast.error("Please login to like a spot");
      return;
    }
    if (likedSpots.includes(touristSpot._id)) {
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
    navigator.share({
      title: touristSpot.name,
      text: touristSpot.description,
      url: `${window.location.origin}/tourist-spot/${touristSpot._id}`,
    });
    toast.success("Link copied to clipboard");
  };

  const handleMouseEnter = () => {
    setTooltip(touristSpot.verified ? "Verified" : "Request Verification");
  };

  return (
    <Link to={`/tourist-spot/${touristSpot._id}`} key={touristSpot._id}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.2 }}
        className="bg-white rounded-md"
      >
        <div className="mt-4 rounded-md overflow-hidden relative">
          <button
            className="absolute top-0 right-0 z-10 p-2 bg-white rounded-bl-md"
            onClick={handleLikeToggle}
          >
            <BiHeart
              className={`${
                likedSpots.includes(touristSpot._id)
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            />
          </button>
          <img
            src={touristSpot.image.secure_url}
            alt={touristSpot.name}
            className="w-full h-64 object-cover rounded-md"
            draggable={false}
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {touristSpot.name}
              </p>
              <p className="text-sm text-gray-500">
                {touristSpot.category.label}
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <p className="text-base font-semibold text-gray-800">
                {formatCurrency(touristSpot.price)}
              </p>
              <p className="text-sm text-gray-500">Per night</p>
            </div>
          </div>
          <div className="flex gap-2">
            {shareIcon && (
              <LuShare2
                className="text-gray-500 hover:text-violet-500 me-2"
                size={24}
                onClick={handleShare}
              />
            )}
            {requestVerification && (
              <MdDomainVerification
                className={classNames(
                  "text-gray-500",
                  touristSpot.verified ? "text-green-500" : "text-red-500"
                )}
                size={24}
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
                    await sendVerificationRequestToAdmins(touristSpot._id)
                      .unwrap()
                      .then(() => {
                        toast.success("Verification request sent");
                      })
                      .catch((e) => {
                        toast.error(e);
                      });
                  } catch (error) {
                    toast.error("An error occurred");
                  }
                }}
              />
            )}
            {tooltip && (
              <div className="absolute z-10 bg-gray-700 text-white text-xs rounded-md p-1 mt-8">
                {tooltip}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default TouristSpotCard;
