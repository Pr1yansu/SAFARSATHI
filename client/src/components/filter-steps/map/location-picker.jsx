import React, { useState, useEffect } from "react";
import Select from "react-select";
import ReactCountryFlag from "react-country-flag";
import { motion } from "framer-motion";
import { useGetCountriesQuery } from "../../../store/apis/countries";
import axios from "axios";
import MapComponent from "./map-component";

const LocationPicker = ({ selectedLocation, setSelectedLocation }) => {
  const { data: countries, error, isLoading } = useGetCountriesQuery();
  const [options, setOptions] = useState([]);
  const [defaultOption, setDefaultOption] = useState(null);

  useEffect(() => {
    const functionToRun = async () => {
      if (countries && countries.length > 0) {
        const formattedOptions = countries.map((country) => ({
          label: country.label,
          value: country.value,
          latlng: country.latlng,
          region: country.region,
          subregion: country.subregion,
          population: country.population,
          languages: country.languages,
          currencies: country.currencies,
          borders: country.borders,
          flag: country.flag,
        }));

        setOptions(formattedOptions);

        const india = formattedOptions.find(
          (country) => country.value === "IN"
        );

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setSelectedLocation({ lat: latitude, lng: longitude });

              // Fetch the address from geocoding API
              const address = await fetchAddress(latitude, longitude);
              setDefaultOption({
                label: address,
                value: `${latitude},${longitude}`,
                latlng: [latitude, longitude],
              });
            },
            async () => {
              setDefaultOption(india || null);
              if (india) {
                setSelectedLocation({
                  lat: india.latlng[0],
                  lng: india.latlng[1],
                });
                const address = await fetchAddress(
                  india.latlng[0],
                  india.latlng[1]
                );
                setDefaultOption({
                  label: address,
                  value: india.value,
                  latlng: india.latlng,
                });
              }
            }
          );
        } else {
          setDefaultOption(india || null);
          if (india) {
            setSelectedLocation({
              lat: india.latlng[0],
              lng: india.latlng[1],
            });
            const address = await fetchAddress(
              india.latlng[0],
              india.latlng[1]
            );
            setDefaultOption({
              label: address,
              value: india.value,
              latlng: india.latlng,
            });
          }
        }
      }
    };

    functionToRun();
  }, [countries, setSelectedLocation]);

  const fetchAddress = async (lat, lng) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted;
      }
      return "Address not found";
    } catch (error) {
      console.error("Geocoding error:", error);
      return "Error fetching address";
    }
  };

  const handleLocationChange = async (selectedOption) => {
    if (selectedOption) {
      const location = countries.find(
        (country) => country.value === selectedOption.value
      );
      if (location && location.latlng) {
        setSelectedLocation({
          lat: location.latlng[0],
          lng: location.latlng[1],
        });
        const address = await fetchAddress(
          location.latlng[0],
          location.latlng[1]
        );
        setDefaultOption({
          label: address,
          value: selectedOption.value,
          latlng: location.latlng,
        });
      }
    }
  };

  useEffect(() => {
    const updateDefaultOption = async () => {
      if (selectedLocation.lat !== null && selectedLocation.lng !== null) {
        const address = await fetchAddress(
          selectedLocation.lat,
          selectedLocation.lng
        );
        setDefaultOption({
          label: address,
          value: `${selectedLocation.lat},${selectedLocation.lng}`,
          latlng: [selectedLocation.lat, selectedLocation.lng],
        });
      }
    };

    updateDefaultOption();
  }, [selectedLocation]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4">
      <motion.div className="relative z-10">
        <Select
          onChange={handleLocationChange}
          options={options}
          placeholder="Select a country"
          isClearable
          value={defaultOption}
          formatOptionLabel={(option) => (
            <div className="flex flex-row items-center gap-3">
              <div className="block">
                <ReactCountryFlag
                  countryCode={option.value}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                  title={option.label}
                />
              </div>
              <div>
                {option.label}
                <span className="text-neutral-800 ml-1">
                  {option.region && `, ${option.region}`}
                </span>
                {option.subregion && (
                  <span className="text-neutral-600 ml-1">
                    {`(${option.subregion})`}
                  </span>
                )}
              </div>
            </div>
          )}
        />
      </motion.div>

      <MapComponent
        location={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        defaultOption={defaultOption}
      />
    </div>
  );
};

export default LocationPicker;
