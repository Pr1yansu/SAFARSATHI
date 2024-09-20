import React, { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import Separator from "../ui/separator";
import Input from "../ui/input";
import IconPicker from "react-icons-picker";

const AmenityCounter = ({ name, count, icon, setAmenities, removeAmenity }) => {
  const increment = () => {
    setAmenities((prev) => ({
      ...prev,
      [name]: { ...prev[name], count: count + 1 },
    }));
  };

  const decrement = () => {
    if (count > 0) {
      setAmenities((prev) => ({
        ...prev,
        [name]: { ...prev[name], count: count - 1 },
      }));
    }
  };

  return (
    <div className="flex items-center justify-between my-4 max-h-[480px] overflow-y-auto">
      <div className="flex items-center gap-2">
        {icon && (
          <IconPicker
            value={icon}
            size={24}
            pickButtonStyle={{
              border: "1px solid #D1D5DB",
              borderRadius: "0.375rem",
              padding: "0.5rem",
            }}
          />
        )}
        <p className="text-base font-semibold text-gray-700 capitalize">
          {name}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={decrement}
          className="p-2 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"
        >
          <BiMinus />
        </button>
        <p className="text-base font-semibold text-gray-800">{count}</p>
        <button
          onClick={increment}
          className="p-2 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"
        >
          <BiPlus />
        </button>
        {removeAmenity && (
          <button
            onClick={() => removeAmenity(name)}
            className="p-2 bg-red-100 text-red-600 rounded-full flex items-center justify-center"
          >
            <FaXmark />
          </button>
        )}
      </div>
    </div>
  );
};

const AmenitiesCounter = ({ amenities, setAmenities }) => {
  const [newAmenityName, setNewAmenityName] = useState("");
  const [newAmenityIcon, setNewAmenityIcon] = useState(null);

  const handleAddAmenity = () => {
    if (newAmenityName && !amenities[newAmenityName]) {
      setAmenities((prev) => ({
        ...prev,
        [newAmenityName]: { count: 0, icon: newAmenityIcon || "BiHome" },
      }));
      setNewAmenityName("");
      setNewAmenityIcon(null);
    }
  };

  const handleRemoveAmenity = (amenityName) => {
    setAmenities((prev) => {
      const updatedAmenities = { ...prev };
      delete updatedAmenities[amenityName];
      return updatedAmenities;
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">
        What amenities do you offer?
      </h3>
      <p className="text-sm text-gray-600">
        Assign a number and an icon to each amenity
      </p>
      <Separator className="my-4" />

      <div>
        {Object.entries(amenities).map(([name, { count, icon }]) => {
          return (
            <AmenityCounter
              key={name}
              name={name}
              count={count}
              icon={icon}
              setAmenities={setAmenities}
              removeAmenity={handleRemoveAmenity}
            />
          );
        })}
      </div>

      <Separator className="my-4" />

      {/* Input to add new amenity */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter new amenity"
          value={newAmenityName}
          onChange={(e) => setNewAmenityName(e.target.value)}
        />
        <IconPicker
          onChange={setNewAmenityIcon}
          value={newAmenityIcon}
          pickButtonStyle={{
            border: "1px solid #D1D5DB",
            borderRadius: "0.375rem",
            padding: "0.5rem",
          }}
        />
        <button
          onClick={handleAddAmenity}
          className="flex items-center gap-1 text-purple-500"
        >
          <IoAddCircleOutline size={24} />
          Add
        </button>
      </div>
    </div>
  );
};

export default AmenitiesCounter;
