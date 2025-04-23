import { createSlice } from '@reduxjs/toolkit';

const logSlice = createSlice({
  name: 'logs',
  initialState: { data: {} },
  reducers: {
    setLogs: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { setLogs } = logSlice.actions;
export default logSlice.reducer;
