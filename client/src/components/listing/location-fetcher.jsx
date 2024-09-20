import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineMapPin } from "react-icons/hi2";

const LocationFetcher = ({ lat, lng, address }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setLocation(address);
      return;
    }
    const fetchLocation = async () => {
      setLoading(true);
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`;

      try {
        const response = await axios.get(url);
        if (response.data.results.length > 0) {
          setLocation(response.data.results[0].formatted);
        } else {
          setLocation("Location not found");
        }
      } catch (error) {
        setLocation("Error fetching location");
        console.error("Geocoding error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-4 bg-black/30 animate-pulse w-60 rounded-md"></div>
    );
  }

  return (
    <p
      className={`text-base font-medium flex gap-2 items-center ${
        location ? "text-gray-800" : "text-red-500"
      }`}
    >
      <HiOutlineMapPin />
      {location}
    </p>
  );
};

export default LocationFetcher;
