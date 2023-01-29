import { createSlice } from '@reduxjs/toolkit';

type popUpState = {
  prodIsOpen: boolean;
  categoryIsOpen: boolean;
  userIsOpen: boolean;
  reserveIsOpen: boolean;
  settingsIsOpen: boolean;
  sideBarIsOpen: boolean;
  uploadIsOpen: boolean;
};

const initialState: popUpState = {
  sideBarIsOpen: true && window.innerWidth > 640,
  prodIsOpen: false,
  categoryIsOpen: false,
  userIsOpen: false,
  settingsIsOpen: false,
  reserveIsOpen: false,
  uploadIsOpen: false,
};

export const popUpSlice = createSlice({
  name: 'toggling',
  initialState,
  reducers: {
    toggleProd: (state) => {
      state.prodIsOpen = !state.prodIsOpen;
    },
    toggleCategory: (state) => {
      state.categoryIsOpen = !state.categoryIsOpen;
    },
    toggleReserve: (state) => {
      state.reserveIsOpen = !state.reserveIsOpen;
    },
    toggleSettings: (state) => {
      state.settingsIsOpen = !state.settingsIsOpen;
    },
    toggleSideBar: (state) => {
      state.sideBarIsOpen = !state.sideBarIsOpen;
    },
    toggleUpload: (state) => {
      state.uploadIsOpen = !state.uploadIsOpen;
    },
  },
});

export default popUpSlice.reducer;
export const {
  toggleUpload,
  toggleProd,
  toggleCategory,
  toggleSettings,
  toggleReserve,
  toggleSideBar,
} = popUpSlice.actions;
