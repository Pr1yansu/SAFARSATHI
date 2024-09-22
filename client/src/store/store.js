// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import likedSpotsReducer from "./slices/like-spots";
import { userApi } from "./apis/user";
import { categoriesApi } from "./apis/categories";
import { touristSpotsApi } from "./apis/touristspots";
import { countriesApi } from "./apis/countries";
import { reserveApi } from "./apis/reserve";
import { chartsApi } from "./apis/charts";
import { newsLetterApi } from "./apis/news-letter";
import { contactApi } from "./apis/contact";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
    [touristSpotsApi.reducerPath]: touristSpotsApi.reducer,
    [reserveApi.reducerPath]: reserveApi.reducer,
    [chartsApi.reducerPath]: chartsApi.reducer,
    [newsLetterApi.reducerPath]: newsLetterApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    likedSpots: likedSpotsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      categoriesApi.middleware,
      countriesApi.middleware,
      touristSpotsApi.middleware,
      reserveApi.middleware,
      chartsApi.middleware,
      newsLetterApi.middleware,
      contactApi.middleware
    ),
});

setupListeners(store.dispatch);
