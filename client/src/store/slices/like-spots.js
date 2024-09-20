import { createSlice } from "@reduxjs/toolkit";

const loadLikedSpots = () => {
  const saved = localStorage.getItem("likedSpots");
  return saved ? JSON.parse(saved) : [];
};

const saveLikedSpots = (likedSpots) => {
  localStorage.setItem("likedSpots", JSON.stringify(likedSpots));
};

const initialState = {
  likedSpots: loadLikedSpots(),
};

const likedSpotsSlice = createSlice({
  name: "likedSpots",
  initialState,
  reducers: {
    addLike: (state, action) => {
      if (!state.likedSpots.includes(action.payload)) {
        state.likedSpots.push(action.payload);
        saveLikedSpots(state.likedSpots);
      }
    },
    removeLike: (state, action) => {
      state.likedSpots = state.likedSpots.filter((id) => id !== action.payload);
      saveLikedSpots(state.likedSpots);
    },
  },
});

export const { addLike, removeLike } = likedSpotsSlice.actions;
export default likedSpotsSlice.reducer;
