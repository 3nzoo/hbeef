import React, { useState } from 'react';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      navigate('/admin');
    } catch (err) {
      setErrors({ general: 'Invalid login credentials' });
    }
  };

  return (
    <div className='bg-gray-200 flex content-center items-center justify-center fixed w-full h-full'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md  min-w-1/2'
      >
        <h2 className='text-lg mb-4'>Login</h2>
        {errors.general && (
          <div className='mb-4 text-red-500'>{errors.general}</div>
        )}
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
        <button className='bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600'>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
