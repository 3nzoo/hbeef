import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { useEffect } from 'react';

const RequireAuth = () => {
  const storageToken = localStorage.getItem('jwtToken');
  const token = useAppSelector((state) => state.auth.user) || storageToken;
  const location = useLocation();

  useEffect(() => {}, []);

  return token && storageToken ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

export default RequireAuth;
