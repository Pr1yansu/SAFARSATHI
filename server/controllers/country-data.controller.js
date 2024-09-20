const countries = require("world-countries");
const LRUCache = require("../utils/cache");

// Create an LRU cache with a limit of 100 entries
const cache = new LRUCache(100);

const getAllCountries = (req, res) => {
  try {
    // Check if the countries are already cached
    const cachedCountries = cache.get("countries");
    if (cachedCountries) {
      return res.status(200).json(cachedCountries); // Return cached data
    }

    // If not cached, format the countries data
    const formattedCountries = countries.map((country) => {
      return {
        value: country.cca2, // Country's 2-letter code
        label: country.name.common, // Country's common name
        latlng: country.latlng, // Country's latitude and longitude
        region: country.region, // Country's region (e.g., Europe)
        subregion: country.subregion, // Country's subregion
        flag: country.flag, // Country's flag emoji
        population: country.population, // Country's population
        languages: Object.values(country.languages || {}), // Country's languages
        currencies: Object.keys(country.currencies || {}), // Country's currencies
        borders: country.borders || [], // Country's neighboring countries
      };
    });

    // Store the formatted data in the cache
    cache.set("countries", formattedCountries);

    // Return the formatted countries as the response
    return res.status(200).json(formattedCountries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllCountries };
