import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ErrorComponent from '../../../components/common/Error';
import SuccessComponent from '../../../components/common/Success';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { togglePassword } from '../../../redux/popUpSlice';
import { updateCredentials } from '../../../hooks/useDynamoDBData';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import { config } from '../../../config';

const roles = ['staff', 'editor', 'assistant'];

interface PasswordFormData {
  previous: string;
  password: string;
}

const ChangePassword = () => {
  const inputRef = useRef(null);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [newError, setNewError] = useState<string | null>(null);
  const [newSuccess, setNewSuccess] = useState('');
  const enterRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState<PasswordFormData>({
    previous: '',
    password: '',
  });

  const user: any = useAppSelector((state) => state.auth.user);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  const getUser = async (username: string) => {
    const params = {
      TableName: config.aws_userTable,
      Key: {
        username,
      },
    };
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    return await dynamodb
      .get(params)
      .promise()
      .then(
        (response) => {
          return response.Item;
        },
        (error) => {
          console.error('Error', error);
        }
      );
  };

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (enterRef.current != null) enterRef.current?.click();
      }
    },
    [formData]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, inputType: string) => {
      if (inputType === 'password') {
        setFormData({ ...formData, password: e.target.value });
      } else {
        setFormData({ ...formData, previous: e.target.value });
      }
    },
    [formData]
  );

  const updateUser = async (item: {}) => {
    const dynamoUser = await getUser(user?.username);
    if (
      !bcrypt.compareSync(formData.previous.toString(), dynamoUser?.password)
    ) {
      setNewError('incorrect current password');
      setNewSuccess('');
      return;
    }

    updateCredentials();
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      region: config.aws_region,
    });

    await dynamodb
      .update({
        TableName: config.aws_userTable,
        Key: { username: user.username },
        UpdateExpression: 'SET #password = :password',
        ExpressionAttributeNames: {
          '#password': 'password',
        },
        ExpressionAttributeValues: {
          ':password': await bcrypt.hash(formData.password, 10),
        },
      })
      .promise();

    setNewSuccess('You have successfully updated your password');
    setNewError(null);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPageLoading(true);

      if (formData.password == '' || formData.previous == '') {
        setNewError('Everything is required! ');
        setNewSuccess('');
      } else {
        updateUser(formData);
        setFormData({ previous: '', password: '' });
        setPageLoading(false);
      }
    },
    [formData]
  );

  const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      return dispatch(togglePassword());
    }
  };

  return (
    <div
      className={
        `bg-gray-900 bg-opacity-80 flex content-center items-center justify-center fixed w-full h-full z-30 backdrop-blur-sm transition-opacity duration-500 ${
          initiate && ' opacity-100 '
        }` + `${!initiate && ' opacity-0'}`
      }
      onClick={closeForm}
    >
      <form
        onSubmit={handleSubmit}
        className={
          `bg-white p-6 rounded-lg shadow-md xs:min-w-[80%] md:min-w-[45%] transition-transform duration-500 ${
            initiate && ' translate-y-0 '
          }` + `${!initiate && ' -translate-y-10'}`
        }
      >
        <div className='flex justify-between mb-6'>
          <h1 className='text-lg text-'>Change your password</h1>
          <AiOutlineCloseCircle
            className='cursor-pointer hover:text-red-500'
            size={26}
            onClick={() => dispatch(togglePassword())}
          />
        </div>

        <div className='mb-8 relative'>
          <label className='block text-gray-700 mb-2'>Current Password</label>
          <input
            className='border border-gray-400 p-2 rounded-lg w-full'
            type={showPass ? 'text' : 'password'}
            ref={inputRef}
            value={formData.previous}
            onChange={(e) => handleChange(e, 'username')}
            onKeyDown={handleKeyDown}
            placeholder={'old password here...'}
          />

          {showPass ? (
            <AiOutlineEyeInvisible
              size={26}
              className='absolute right-3 top-10'
              onClick={() => setShowPass(!showPass)}
            />
          ) : (
            <AiOutlineEye
              size={26}
              className='absolute right-3 top-10'
              onClick={() => setShowPass(!showPass)}
            />
          )}
        </div>
        <div className='mb-5 relative'>
          <label className='block text-gray-700 mb-2'>New Password</label>
          <input
            className='border border-gray-400 p-2 rounded-lg w-full'
            type={showNewPass ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange(e, 'password')}
            onKeyDown={handleKeyDown}
            placeholder={'type your new password...'}
          />
          {showNewPass ? (
            <AiOutlineEyeInvisible
              size={26}
              className='absolute right-3 top-10'
              onClick={() => setShowNewPass(!showNewPass)}
            />
          ) : (
            <AiOutlineEye
              size={26}
              className='absolute right-3 top-10'
              onClick={() => setShowNewPass(!showNewPass)}
            />
          )}
        </div>

        {newError && <ErrorComponent message={newError} />}
        {newSuccess.length > 1 && <SuccessComponent message={newSuccess} />}
        <div className='mb-3'>
          <button
            className={
              `bg-indigo-500 text-white p-3 rounded-lg px-5 hover:bg-indigo-800 float-right mt-5 ` +
              `${pageLoading ? 'disabled' : ''} `
            }
            ref={enterRef}
          >
            Save Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
