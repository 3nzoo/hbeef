import { configureStore } from '@reduxjs/toolkit';
import sideBarReducer from './sidebarSlice';
import togglingReducer from './popUpSlice';

const adminStore = configureStore({
  reducer: {
    sidebar: sideBarReducer,
    toggling: togglingReducer,
  },
});

export default adminStore;

export type RootState = ReturnType<typeof adminStore.getState>;

export type AppDispatch = typeof adminStore.dispatch;
