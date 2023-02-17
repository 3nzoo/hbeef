import { createSlice } from '@reduxjs/toolkit';

type toggleState = {
  navIsOpen: boolean;
};

const initialState: toggleState = {
  navIsOpen: false,
};

export const toggleSlice = createSlice({
  name: 'toggle',
  initialState,
  reducers: {
    toggleNav: (state) => {
      state.navIsOpen = !state.navIsOpen;
    },
  },
});

export default toggleSlice.reducer;
export const { toggleNav } = toggleSlice.actions;
