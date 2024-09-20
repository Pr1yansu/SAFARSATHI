import React from "react";
import Input from "../ui/input";
import Label from "../ui/label";
import TextArea from "../ui/text-area";

const DescriptionPricing = ({
  description,
  setDescription,
  price,
  setPrice,
  address,
  setAddress,
  name,
  setName,
}) => {
  return (
    <div className="bg-white rounded-lg max-h-[480px] overflow-y-auto">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">
        Description and Pricing
      </h4>
      <p className="text-gray-400 mb-3 text-xs font-semibold">
        Describe your place and set a price. Be sure to include any additional
        fees.
      </p>

      <div className="space-y-2">
        <div>
          <Label htmlFor="name" className="text-gray-700">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter the name of your place"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-gray-700">
            Description
          </Label>
          <TextArea
            id="description"
            type="text"
            placeholder="Write a detailed description of your place"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <Label htmlFor="price" className="text-gray-700">
            Price
          </Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter the price per night"
            value={price}
            onChange={(e) => {
              if (e.target.value < 0) {
                setPrice(0);
              } else {
                setPrice(e.target.value);
              }
            }}
            className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-gray-700">
            Address
          </Label>
          <TextArea
            id="address"
            type="text"
            placeholder="Enter the address of your place"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

export default DescriptionPricing;
