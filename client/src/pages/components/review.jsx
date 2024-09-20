import React, { useState, useEffect, useCallback } from "react";
import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";
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

  const [rating, setRating] = useState(existingReview?.rating || 0);
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
      if (response.error) {
        throw new Error(response.error.message);
      }

      refetch();
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Leave a Review</h2>
      {loadingReview ? (
        <p>Loading your review...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <label className="flex flex-col">
              <span className="text-xs font-medium mb-2">Rating:</span>
              <Rating
                initialRating={rating}
                onChange={handleRating}
                emptySymbol={<FaRegStar className="text-gray-400" />}
                fullSymbol={<FaStar className="text-yellow-500" />}
                fractions={2}
                className="flex"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium mb-2">Comment:</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="4"
              required
            ></textarea>
          </label>
          <Button
            type="submit"
            className="rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            {existingReview ? "Update Review" : "Add Review"}
          </Button>
        </form>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Other Reviews:</h3>
        {reviews?.length ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 mb-4 border border-gray-200 rounded-lg"
            >
              <p className="text-base font-medium mb-1">{review.user.name}</p>
              <p className="text-sm text-gray-600 mb-1">{review.user.email}</p>
              <p className="mb-2">{formatDate(review.date)}</p>
              <div className="flex items-center mb-2">
                <Rating
                  initialRating={review.rating}
                  emptySymbol={<FaRegStar className="text-gray-400" />}
                  fullSymbol={<FaStar className="text-yellow-500" />}
                  readonly
                  className="flex"
                />
              </div>
              <p>
                <strong>Comment:</strong> {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </>
  );
});

export default ReviewTouristSpot;
