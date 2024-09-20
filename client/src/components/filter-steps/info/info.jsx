import React from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import Separator from "../../ui/separator";

const InfoItem = ({ label, value, onDecrease, onIncrease }) => (
  <div className="my-4 space-y-2 flex justify-between items-center">
    <div>
      <h4 className="text-sm font-semibold text-gray-800 uppercase">{label}</h4>
      <p className="text-xs text-gray-600">How many {label.toLowerCase()}?</p>
    </div>
    <div className="flex items-center">
      <button intent="outline" onClick={onDecrease}>
        <CiCircleMinus
          size={32}
          className="text-gray-800 hover:text-purple-600 duration-150"
        />
      </button>
      <p className="text-sm font-semibold text-gray-800 px-4">{value}</p>
      <button onClick={onIncrease}>
        <CiCirclePlus
          size={32}
          className="text-gray-800 hover:text-purple-600 duration-150"
        />
      </button>
    </div>
  </div>
);

const Info = ({ moreInfo, setMoreInfo }) => {
  const updateValue = (key, amount, min = 1) => {
    setMoreInfo((prev) => ({
      ...prev,
      [key]: Math.max(min, prev[key] + amount),
    }));
  };

  return (
    <>
      <InfoItem
        label="Guests"
        value={moreInfo.guests}
        onDecrease={() => updateValue("guests", -1)}
        onIncrease={() => updateValue("guests", 1)}
      />
      <Separator className="my-2" />
      <InfoItem
        label="Rooms"
        value={moreInfo.rooms}
        onDecrease={() => updateValue("rooms", -1)}
        onIncrease={() => updateValue("rooms", 1)}
      />
      <Separator className="my-2" />
      <InfoItem
        label="Adults"
        value={moreInfo.adults}
        onDecrease={() => updateValue("adults", -1)}
        onIncrease={() => updateValue("adults", 1)}
      />
      <Separator className="my-2" />
      <InfoItem
        label="Children"
        value={moreInfo.children}
        onDecrease={() => updateValue("children", -1, 0)}
        onIncrease={() => updateValue("children", 1, 0)}
      />
      <Separator className="my-2" />
      <InfoItem
        label="Infants"
        value={moreInfo.infants}
        onDecrease={() => updateValue("infants", -1, 0)}
        onIncrease={() => updateValue("infants", 1, 0)}
      />
    </>
  );
};

export default Info;
