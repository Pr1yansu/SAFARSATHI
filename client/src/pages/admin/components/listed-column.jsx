import React from "react";
import { formatCurrency, formatDate } from "../../../components/utils/utils";
import {
  useGetTouristSpotsQuery,
  useVerifyTouristSpotMutation,
} from "../../../store/apis/touristspots";

const Actions = ({ row }) => {
  const [verified, setVerified] = React.useState(row.original.verified);
  const [verifyTouristSpot] = useVerifyTouristSpotMutation();
  const { refetch: refetchTouristSpots } = useGetTouristSpotsQuery();

  const handleChange = async (e) => {
    setVerified(e.target.value);
    try {
      const { data, error } = await verifyTouristSpot({
        id: row.original._id,
        verified: e.target.value,
      });
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        refetchTouristSpots();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-start">
      <select
        className="border border-gray-300 rounded-md px-2 py-1"
        value={verified}
        onChange={handleChange}
      >
        <option
          value="true"
          className="bg-green-100 text-green-600 font-semibold"
        >
          Yes
        </option>
        <option value="false" className="bg-red-100 text-red-600 font-semibold">
          No
        </option>
      </select>
    </div>
  );
};

const ListedColumn = [
  {
    header: "ID",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {row.original._id}
        </p>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "Location",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {row.original.location?.address || "N/A"}
        </p>
      );
    },
  },
  {
    header: "Price",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {formatCurrency(row.original.price) || "N/A"}
        </p>
      );
    },
  },
  {
    header: "Rating",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {row.original.reviews.length > 0
            ? row.original.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
              row.original.reviews.length
            : "N/A"}
        </p>
      );
    },
  },
  {
    header: "Host",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {row.original.host?.name.split(" ")[0] || "N/A"}
        </p>
      );
    },
  },
  {
    header: "Created At",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {formatDate(row.original.createdAt) || "N/A"}
        </p>
      );
    },
  },
  {
    header: "Updated At",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {formatDate(row.original.updatedAt) || "N/A"}
        </p>
      );
    },
  },
  {
    header: "Verified",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

export default ListedColumn;
