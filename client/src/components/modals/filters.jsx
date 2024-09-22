import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useModal from "../hooks/modal";
import { IoCloseOutline } from "react-icons/io5";
import Step from "../filter-steps/step";
import Navigation from "../filter-steps/navigation";
import Button from "../ui/button";
import { useSearchParams } from "react-router-dom";

const Filters = () => {
  const [, setSearchParams] = useSearchParams();
  const { close, isOpen, variant } = useModal();
  const [selectedLocation, setSelectedLocation] = useState({
    lat: null,
    lng: null,
    address: "",
  });
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [moreInfo, setMoreInfo] = useState({
    guests: 1,
    rooms: 1,
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, name: "Location" },
    { id: 2, name: "Time" },
    { id: 3, name: "Guests and Rooms" },
  ];

  const resetFilters = () => {
    setSelectedLocation({ lat: 37.0902, lng: -95.7129 });
    setDateRange([new Date(), new Date()]);
    setMoreInfo({ guests: 1, rooms: 1, adults: 1, children: 0, infants: 0 });
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSearchParams({
        location: `${selectedLocation.lat},${selectedLocation.lng}`,
        checkin: dateRange[0].toISOString().split("T")[0],
        checkout: dateRange[1].toISOString().split("T")[0],
        guests: moreInfo.guests,
        rooms: moreInfo.rooms,
        adults: moreInfo.adults,
        children: moreInfo.children,
        infants: moreInfo.infants,
      });
      close();
    }
  };

  useEffect(() => {
    if (!isOpen) resetFilters();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && variant === "filters" && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <motion.div
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg m-4 relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Button className="absolute p-1.5" size="icon" intent="ghost">
              <IoCloseOutline
                className="cursor-pointer"
                onClick={close}
                size={20}
              />
            </Button>
            <div className="h-[450px] overflow-y-auto">
              <Step
                step={steps[currentStep]}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                dateRange={dateRange}
                setDateRange={setDateRange}
                moreInfo={moreInfo}
                setMoreInfo={setMoreInfo}
              />
            </div>
            <Navigation
              currentStep={currentStep}
              steps={steps}
              nextStep={nextStep}
              prevStep={() =>
                currentStep > 0 && setCurrentStep(currentStep - 1)
              }
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Filters;
