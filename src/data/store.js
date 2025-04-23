import { configureStore } from '@reduxjs/toolkit';
import logReducer from './logSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    logs: logReducer,
    filters: filterReducer
  }
});
