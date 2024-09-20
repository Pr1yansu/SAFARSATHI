import React from "react";
import { useSelector } from "react-redux";
import { useGetTouristSpotByIdsQuery } from "../store/apis/touristspots";
import Loader from "../components/ui/loader";
import TouristSpotCard from "../components/ui/tourist-spot-card";

const FavoriteListings = () => {
  const likedSpots = useSelector((state) => state.likedSpots.likedSpots);
  const {
    data: touristSpots,
    isLoading: touristSpotsIsLoading,
    isFetching: touristSpotsIsFetching,
  } = useGetTouristSpotByIdsQuery(likedSpots);

  if (touristSpotsIsLoading || touristSpotsIsFetching) {
    return <Loader />;
  }

  if (likedSpots.length === 0) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mt-6">
            Favorite Listings
          </h1>
          <p className="text-gray-600 mt-4">
            You have no favorite listings yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {touristSpots.map((spot, _) => {
          return (
            <TouristSpotCard key={spot._id} touristSpot={spot} index={_} />
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteListings;
