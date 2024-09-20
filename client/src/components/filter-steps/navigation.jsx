import React from "react";
import Button from "../ui/button";

const Navigation = ({ currentStep, steps, nextStep, prevStep }) => {
  return (
    <div className="flex justify-between mt-4 gap-2">
      <Button
        className={`px-4 py-2 rounded-md w-full ${
          currentStep === 0 ? "hidden" : ""
        }`}
        onClick={prevStep}
        disabled={currentStep === 0}
      >
        Back
      </Button>
      <Button className="px-4 py-2 rounded-md w-full" onClick={nextStep}>
        Search
      </Button>
    </div>
  );
};

export default Navigation;
