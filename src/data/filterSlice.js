import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  values: {
    tag: [],
    level: [],
    log_type: []
  },
  available: {}
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      const current = state.values[key] || [];
      if (current.includes(value)) {
        state.values[key] = current.filter(v => v !== value);
      } else {
        state.values[key] = [...current, value];
      }
    },
    clearFilter: (state, action) => {
      state.values[action.payload] = [];
    },
    clearAllFilters: (state) => {
      Object.keys(state.values).forEach(key => state.values[key] = []);
    },
    setAvailableFilters: (state, action) => {
      state.available = action.payload;
    }
  }
});

export const {
  setFilter,
  clearFilter,
  clearAllFilters,
  setAvailableFilters
} = filterSlice.actions;

export default filterSlice.reducer;
