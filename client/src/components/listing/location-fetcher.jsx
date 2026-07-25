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
      if (!lat || !lng) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        if (response.data && response.data.display_name) {
          const parts = response.data.display_name.split(",");
          const shortAddress = parts.slice(0, 3).join(",").trim();
          setLocation(shortAddress || response.data.display_name);
        } else {
          setLocation(`Lat: ${Number(lat).toFixed(2)}, Lng: ${Number(lng).toFixed(2)}`);
        }
      } catch (error) {
        setLocation(`Location (${Number(lat).toFixed(2)}, ${Number(lng).toFixed(2)})`);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, address]);

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
