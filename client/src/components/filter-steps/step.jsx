import React from "react";
import LocationPicker from "./map/location-picker";
import Separator from "../ui/separator";
import Calendar from "./time/calender";
import Info from "./info/info";

const Step = ({
  step,
  selectedLocation,
  setSelectedLocation,
  dateRange,
  setDateRange,
  moreInfo,
  setMoreInfo,
}) => {
  const renderStepContent = () => {
    switch (step.name) {
      case "Location":
        return (
          <LocationPicker
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        );
      case "Time":
        return (
          <>
            <div className="my-4 space-y-2">
              <h3 className="text-xl font-semibold text-gray-800 uppercase">
                When do you plan to go?
              </h3>
              <div className="flex items-center justify-between flex-wrap">
                <p className="text-sm text-gray-600">
                  Make sure everyone is free
                </p>
                <p className="text-sm text-gray-600">
                  {dateRange[0].toDateString()} - {dateRange[1].toDateString()}
                </p>
              </div>
            </div>
            <Calendar dateRange={dateRange} setDateRange={setDateRange} />
          </>
        );
      case "Guests and Rooms":
        return (
          <>
            <div className="my-4 space-y-2">
              <h3 className="text-xl font-semibold text-gray-800 uppercase">
                How many people will be there?
              </h3>
              <p className="text-sm text-gray-600">
                Make sure everyone has a place to sleep
              </p>
            </div>
            <Info moreInfo={moreInfo} setMoreInfo={setMoreInfo} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 text-center uppercase my-4">
        Filters
      </h2>
      <Separator className={"my-4"} />
      {renderStepContent()}
    </div>
  );
};

export default Step;
