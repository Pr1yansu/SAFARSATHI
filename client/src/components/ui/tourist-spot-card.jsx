import { BiHeart } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/utils";
import { addLike, removeLike } from "../../store/slices/like-spots";
import { useProfileQuery } from "../../store/apis/user";
import toast from "react-hot-toast";

const TouristSpotCard = ({ touristSpot, index }) => {
  const { data: profile, isLoading, isFetching } = useProfileQuery();
  const dispatch = useDispatch();
  const likedSpots = useSelector((state) => state.likedSpots.likedSpots);

  if (isLoading || isFetching) {
    return null;
  }

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
            onClick={(e) => {
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
            }}
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
      </motion.div>
    </Link>
  );
};

export default TouristSpotCard;
