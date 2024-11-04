import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Navigate } from 'react-router-dom';
import logo from '/images/logosmall.png';
import { setCredentials } from '../../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import axios from 'axios';
import { config } from '../../config';

interface FormData {
  username: string;
  password: string;
}

interface Errors {
  username?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const currentUser = useAppSelector((state) => state.auth.user);

  const currUrl = config.aws_apiUrl;

  const keyis = {
    headers: {
      'x-api-key': config.aws_headers,
    },
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(currUrl + 'login', formData, keyis);

      if (response.data) {
        localStorage.setItem('jwtToken', JSON.stringify(response.data));
      }
      dispatch(setCredentials(response.data));
      localStorage.setItem('jwtToken', response.data.token);
      navigate('/admin');
    } catch (err) {
      setErrors({ general: 'Invalid login credentials' });
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return <Navigate to='/admin' state={{ from: location }} replace />;
  }

  return (
    <div className='bg-yellow-350 flex flex-col content-center items-center justify-center fixed w-full h-full'>
      <div className='cursor-pointer' onClick={() => navigate('/')}>
        <img src={logo} width='250px' alt='Logo' className='-mt-16' />
      </div>
      <form
        onSubmit={handleSubmit}
        className='bg-yellow-250 p-6 rounded-lg shadow-md mt-5 min-w-1/2'
      >
        <h2 className='text-lg mb-4'>Admin Login</h2>

        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>Username</label>
          <input
            type='text'
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className={`border border-gray-400 p-2 rounded-lg w-full ${
              errors.username ? 'border-red-500' : ''
            }`}
          />
          {errors.username && (
            <div className='text-red-500'>{errors.username}</div>
          )}
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>Password</label>
          <input
            type='password'
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`border border-gray-400 p-2 rounded-lg w-full ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && (
            <div className='text-red-500'>{errors.password}</div>
          )}
        </div>
        {errors.general && (
          <div className='mb-4 text-red-500'>{errors.general}</div>
        )}
        <button
          className='bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 disabled:bg-gray-600'
          disabled={loading}
        >
          Login
        </button>
      </form>
      {currentUser && <p>{Object.values(currentUser)[0]}</p>}
    </div>
  );
};

export default Login;
