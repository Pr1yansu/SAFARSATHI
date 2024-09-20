import React from "react";
import Info from "../filter-steps/info/info";

const GuestsAndRooms = ({ moreInfo, setMoreInfo }) => {
  return (
    <div>
      <div className="my-4 space-y-2">
        <h3 className="text-xl font-semibold text-gray-800 uppercase">
          How many people can stay?
        </h3>
        <p className="text-sm text-gray-600">
          Make sure everyone has a place to sleep
        </p>
      </div>
      <Info moreInfo={moreInfo} setMoreInfo={setMoreInfo} />
    </div>
  );
};

export default GuestsAndRooms;
