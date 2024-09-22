import React from "react";
import { useGetCurrentUserListedHomesQuery } from "../store/apis/touristspots";
import Loader from "../components/ui/loader";
import TouristSpotCard from "../components/ui/tourist-spot-card";

const ListedHomes = () => {
  const {
    data: listedHomes,
    isLoading: listedHomesIsLoading,
    isFetching: listedHomesIsFetching,
    error: listedHomesError,
  } = useGetCurrentUserListedHomesQuery();

  if (listedHomesIsLoading || listedHomesIsFetching) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4">
      {listedHomesError ? (
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mt-6">
              Your Listings
            </h1>
            <p className="text-gray-600 mt-4">
              {listedHomesError || "You have no listings yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {listedHomes.map((home, _) => {
            return (
              <TouristSpotCard
                key={home._id}
                touristSpot={home}
                index={_}
                shareIcon={true}
                requestVerification={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListedHomes;
