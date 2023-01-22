import { createSlice } from '@reduxjs/toolkit';

type sideBarState = {
  isOpen: boolean;
};

const initialState: sideBarState = {
  isOpen: true && window.innerWidth > 640,
};

export const sideBarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export default sideBarSlice.reducer;
export const { toggle } = sideBarSlice.actions;
