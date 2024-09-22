import React, { useEffect } from "react";
import { useGetCategoriesQuery } from "../store/apis/categories";
import { IconPickerItem } from "react-icons-picker";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useGetTouristSpotsQuery } from "../store/apis/touristspots";
import InfiniteLoader from "../components/ui/infinite-loader";
import Loader from "../components/ui/loader";
import { useInView } from "react-intersection-observer";
import TouristSpotCard from "../components/ui/tourist-spot-card";
import Button from "../components/ui/button";
import { IoCloseOutline } from "react-icons/io5";
import { debounce } from "lodash";

const Home = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: categories,
    isLoading,
    isFetching,
    error,
  } = useGetCategoriesQuery();
  const [page, setPage] = React.useState(1);
  const [spots, setSpots] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);

  const {
    data: touristSpots,
    isLoading: touristSpotsIsLoading,
    isFetching: touristSpotsIsFetching,
    refetch: refetchTouristSpots,
  } = useGetTouristSpotsQuery({
    page: page,
    category: searchParams.get("category"),
    location: searchParams.get("location"),
    checkin: searchParams.get("checkin"),
    checkout: searchParams.get("checkout"),
    guests: searchParams.get("guests"),
    rooms: searchParams.get("rooms"),
    adults: searchParams.get("adults"),
    children: searchParams.get("children"),
    infants: searchParams.get("infants"),
  });

  useEffect(() => {
    if (!touristSpotsIsLoading && !touristSpotsIsFetching) {
      if (touristSpots?.touristSpots) {
        setSpots((prev) => [...prev, ...touristSpots.touristSpots]);

        if (touristSpots?.touristSpots.length < 10) {
          setHasMore(false);
        }
      }
    }
  }, [
    touristSpots?.touristSpots,
    touristSpotsIsLoading,
    touristSpotsIsFetching,
  ]);

  useEffect(() => {
    if (inView && hasMore) {
      const debouncedFetch = debounce(() => {
        setPage((prev) => prev + 1);
      }, 500);

      debouncedFetch();

      return () => {
        debouncedFetch.cancel();
      };
    }
  }, [inView, hasMore]);

  useEffect(() => {
    setSpots([]);
    setPage(1);
    setHasMore(true);
    refetchTouristSpots();
  }, [searchParams, refetchTouristSpots]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto my-10">
      <motion.div
        className="flex overflow-x-scroll p-2 gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories?.map((category) => (
          <motion.div
            key={category._id}
            variants={itemVariants}
            className={classNames(
              "flex flex-col items-center gap-2 p-2 bg-white rounded-md cursor-pointer hover:shadow-md hover:border-zinc-200 border-transparent border px-4 duration-200",
              searchParams.get("category") === category._id && "border-zinc-200"
            )}
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              if (newParams.get("category") === category._id) {
                newParams.delete("category");
              } else {
                newParams.set("category", category._id);
              }
              setSearchParams(newParams);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div>
              <IconPickerItem value={category.icon} size={24} color="#36454F" />
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {category.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
      {Object.keys(Object.fromEntries(searchParams)).length > 0 && (
        <Button
          size="sm"
          intent="ghost"
          className={"mt-4 gap-2 font-semibold ml-auto"}
          onClick={() => setSearchParams({})}
        >
          <IoCloseOutline
            size={20}
            className="border border-gray-300 rounded-md p-1"
          />
          Clear Filters
        </Button>
      )}
      <motion.div
        className="grid grid-cols-5 gap-4 mt-4 p-4 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {touristSpotsIsLoading ? (
          [...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-md animate-pulse">
              <div className="mt-4">
                <div className="w-full h-64 bg-gray-300 rounded-md"></div>
              </div>
              <div className="py-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded-md"></div>
                <div className="flex items-baseline gap-3">
                  <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            {error ? (
              <p>{error.message ? error : "An error occurred"}</p>
            ) : (
              spots?.map((touristSpot, index) => (
                <React.Fragment key={touristSpot._id}>
                  {touristSpot.verified && (
                    <TouristSpotCard touristSpot={touristSpot} index={index} />
                  )}
                </React.Fragment>
              ))
            )}
          </>
        )}
        {touristSpotsIsFetching &&
          !touristSpotsIsLoading &&
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-md animate-pulse">
              <div className="mt-4">
                <div className="w-full h-64 bg-gray-300 rounded-md"></div>
              </div>
              <div className="py-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded-md"></div>
                <div className="flex items-baseline gap-3">
                  <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
      </motion.div>
      {hasMore ? (
        <div ref={ref} className="mt-20">
          <InfiniteLoader />
        </div>
      ) : (
        <>
          {!error && (
            <div className="flex justify-center items-center py-4">
              <p className="text-sm font-semibold text-gray-500">
                No more data
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
