import { createSlice } from '@reduxjs/toolkit';

type sideBarState = {
  sideBarIsOpen: boolean;
};

const initialState: sideBarState = {
  sideBarIsOpen: true && window.innerWidth > 640,
};

export const sideBarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggle: (state) => {
      state.sideBarIsOpen = !state.sideBarIsOpen;
    },
  },
});

export default sideBarSlice.reducer;
export const { toggle } = sideBarSlice.actions;
