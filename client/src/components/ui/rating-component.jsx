import React from "react";
import Rating from "react-rating";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingComponent = ({ rating, setRating }) => {
  return (
    <Rating
      initialRating={rating}
      emptySymbol={<FaRegStar />}
      fullSymbol={<FaStar />}
      fractions={2}
      onChange={setRating}
    />
  );
};

export default RatingComponent;
