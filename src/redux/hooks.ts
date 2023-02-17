import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './adminStore';
import type { RootClientState, AppClientDispatch } from './clientStore';
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useClientAppDispatch = () => useDispatch<AppClientDispatch>();
export const useClientAppSelector: TypedUseSelectorHook<RootClientState> =
  useSelector;
