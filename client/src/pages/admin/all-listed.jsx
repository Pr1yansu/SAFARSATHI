import React, { useMemo } from "react";
import { useGetTouristSpotsQuery } from "../../store/apis/touristspots";
import TableComponent from "../../components/ui/table";
import ListedColumn from "./components/listed-column";
import Button from "../../components/ui/button";
import classNames from "classnames";

const AllListedHomes = () => {
  const [page, setPage] = React.useState(1);
  const {
    data: listedHomes,
    isLoading: listedHomesIsLoading,
    isFetching: listedHomesIsFetching,
  } = useGetTouristSpotsQuery({ page });

  const formatListedHomes = useMemo(() => {
    return listedHomes?.touristSpots.map((home, index) => {
      return {
        ...home,
      };
    });
  }, [listedHomes?.touristSpots]);

  return (
    <div className="container mx-auto px-4 my-12 rounded-md overflow-x-scroll">
      {listedHomesIsFetching || listedHomesIsLoading ? (
        <div className="border gap-4 w-full h-96 flex justify-center items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      ) : (
        <TableComponent
          columns={ListedColumn}
          data={formatListedHomes}
          isLoading={listedHomesIsLoading}
        />
      )}
      <div className="flex justify-end items-center mt-4 gap-2">
        <Button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          size="sm"
          className={classNames(
            "rounded-sm",
            page === 1 ? "cursor-not-allowed" : "cursor-pointer"
          )}
          intent="outline"
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          className={classNames(
            "rounded-sm",
            page === listedHomes?.total
              ? "cursor-not-allowed"
              : "cursor-pointer"
          )}
          size="sm"
          disabled={page === Math.ceil(listedHomes?.total / 10)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AllListedHomes;
