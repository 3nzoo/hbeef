import { configureStore } from '@reduxjs/toolkit';
import toggleReducer from './toggleSlice';
import cartReducer from './cartSlice';

const clientStore = configureStore({
  reducer: {
    toggle: toggleReducer,
    cart: cartReducer,
  },
});

export default clientStore;

export type RootClientState = ReturnType<typeof clientStore.getState>;
export type AppClientDispatch = typeof clientStore.dispatch;
