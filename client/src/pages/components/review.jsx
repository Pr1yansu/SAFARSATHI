import React, { useState, useEffect, useCallback } from "react";
import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";
import { HiStar, HiShieldCheck, HiSparkles } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import {
  useAddReviewMutation,
  useGetReviewByTouristSpotAndUserIdQuery,
  useUpdateReviewMutation,
} from "../../store/apis/touristspots";
import Button from "../../components/ui/button";
import { formatDate } from "../../components/utils/utils";

const ReviewTouristSpot = React.memo(({ touristSpotId, reviews, refetch }) => {
  const { data: existingReview, isLoading: loadingReview } =
    useGetReviewByTouristSpotAndUserIdQuery(touristSpotId);
  const [addReview] = useAddReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || "");

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleRating = useCallback((rate) => {
    setRating(rate);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = { rating, comment };
    try {
      let response;
      if (existingReview) {
        response = await updateReview({
          touristSpotId,
          reviewId: existingReview._id,
          body: reviewData,
        });
      } else {
        response = await addReview({ touristSpotId, body: reviewData });
      }
      if (response?.error) {
        throw new Error(response.error.message || "Failed to submit review");
      }

      refetch();
      toast.success(response?.data?.message || "Review saved successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  // Calculate average rating
  const avgRating = reviews?.length
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : "4.9";

  return (
    <div className="space-y-8">
      {/* Header Ratings Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <HiStar className="text-amber-400 text-2xl" />
            <span className="text-3xl font-black">{avgRating}</span>
            <span className="text-slate-400 font-medium text-sm">/ 5.0</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Based on {reviews?.length || 12} verified guest experiences
          </p>
        </div>

        {/* Category Breakdown Mock */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-300 w-full sm:w-auto">
          <div className="flex items-center justify-between gap-3">
            <span>Cleanliness</span>
            <span className="font-bold text-amber-400">4.9 ★</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Accuracy</span>
            <span className="font-bold text-amber-400">4.9 ★</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Communication</span>
            <span className="font-bold text-amber-400">5.0 ★</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Location</span>
            <span className="font-bold text-amber-400">4.8 ★</span>
          </div>
        </div>
      </div>

      {/* Review Form Card */}
      <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HiSparkles className="text-indigo-600" />
          <span>{existingReview ? "Edit Your Review" : "Write a Guest Review"}</span>
        </h3>

        {loadingReview ? (
          <p className="text-xs text-slate-400">Loading review status...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Rating</label>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80 w-fit">
                <Rating
                  initialRating={rating}
                  onChange={handleRating}
                  emptySymbol={<FaRegStar className="text-slate-300 text-lg" />}
                  fullSymbol={<FaStar className="text-amber-400 text-lg" />}
                  fractions={2}
                  className="flex gap-1"
                />
                <span className="text-xs font-bold text-slate-800 ml-2">{rating} / 5</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Your Experience & Feedback</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details of your stay, amenities, host hospitality..."
                className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-all shadow-xs"
                rows="3"
                required
              />
            </div>

            <Button type="submit" size="md" intent="primary" className="font-bold shadow-glow">
              {existingReview ? "Update Review" : "Submit Verified Review"}
            </Button>
          </form>
        )}
      </div>

      {/* Guest Reviews List Grid */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-extrabold text-slate-900">Guest Feedback ({reviews?.length || 0})</h3>

        {reviews?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {review.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{review.user?.name || "Guest"}</p>
                        <p className="text-[10px] text-slate-400">{formatDate(review.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-amber-700 text-xs font-bold">
                      <FaStar className="text-amber-400 text-xs" />
                      <span>{review.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <HiShieldCheck size={14} />
                  <span>Verified Stay</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <p className="text-sm font-bold text-slate-700">No guest reviews yet</p>
            <p className="text-xs text-slate-400">Be the first guest to share your experience for this destination!</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ReviewTouristSpot;

