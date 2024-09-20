import { create } from "zustand";
import axios from "axios";

const useCountries = create((set) => ({
  countries: [],
  loading: false,
  error: null,
  fetchCountries: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/countries`
      );
      set({ countries: response.data });
    } catch (error) {
      set({ error: error.message || "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCountries;
