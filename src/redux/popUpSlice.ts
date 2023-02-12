import { createSlice } from '@reduxjs/toolkit';

type popUpState = {
  passwordIsOpen: boolean;
  addContactIsOpen: boolean;
  prodIsOpen: boolean;
  categoryIsOpen: boolean;
  userIsOpen: boolean;
  reserveIsOpen: boolean;
  settingsIsOpen: boolean;
  sideBarIsOpen: boolean;
  uploadIsOpen: boolean;
  editProdIsOpen: boolean;
  confirmIsOpen: boolean;
  modalIsOpen: boolean;
};

const initialState: popUpState = {
  sideBarIsOpen: true && window.innerWidth > 640,
  passwordIsOpen: false,
  addContactIsOpen: false,
  prodIsOpen: false,
  categoryIsOpen: false,
  userIsOpen: false,
  settingsIsOpen: false,
  reserveIsOpen: false,
  uploadIsOpen: false,
  editProdIsOpen: false,
  confirmIsOpen: false,
  modalIsOpen: false,
};

export const popUpSlice = createSlice({
  name: 'toggling',
  initialState,
  reducers: {
    toggleAddContact: (state) => {
      state.addContactIsOpen = !state.addContactIsOpen;
    },
    togglePassword: (state) => {
      state.passwordIsOpen = !state.passwordIsOpen;
    },
    toggleModalBox: (state) => {
      state.modalIsOpen = !state.modalIsOpen;
    },
    toggleConfirmDelete: (state) => {
      state.confirmIsOpen = !state.confirmIsOpen;
    },
    toggleEditProd: (state) => {
      state.editProdIsOpen = !state.editProdIsOpen;
    },
    toggleProd: (state) => {
      state.prodIsOpen = !state.prodIsOpen;
    },
    toggleAddUser: (state) => {
      state.userIsOpen = !state.userIsOpen;
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
  toggleAddContact,
  togglePassword,
  toggleModalBox,
  toggleConfirmDelete,
  toggleEditProd,
  toggleUpload,
  toggleProd,
  toggleCategory,
  toggleSettings,
  toggleReserve,
  toggleAddUser,
  toggleSideBar,
} = popUpSlice.actions;
