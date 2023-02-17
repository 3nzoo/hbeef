import { configureStore } from '@reduxjs/toolkit';
import sideBarReducer from './sidebarSlice';
import togglingReducer from './popUpSlice';
import categoriesReducer from './categorySlice';
import authReducer from './authSlice';

const adminStore = configureStore({
  reducer: {
    sidebar: sideBarReducer,
    toggling: togglingReducer,
    categories: categoriesReducer,
    auth: authReducer,
  },
});

export default adminStore;

export type RootState = ReturnType<typeof adminStore.getState>;

export type AppClientDispatchAppDispatch = typeof adminStore.dispatch;
