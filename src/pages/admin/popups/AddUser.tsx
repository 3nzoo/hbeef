import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ErrorComponent from '../../../components/common/Error';
import SuccessComponent from '../../../components/common/Success';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleAddUser } from '../../../redux/popUpSlice';
import { v4 as uuidv4 } from 'uuid';
import { updateCredentials } from '../../../hooks/useDynamoDBData';
import { iUser } from '../../../../constant/interface';

import { BiCopy } from 'react-icons/bi';
import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
// import * as bcrypt from 'bcrypt';

const roles = ['staff', 'editor', 'assistant'];

interface UserFormData {
  username: string;
  password: string;
  role: string;
}
interface addUserProps {
  reloadMenu: () => void;
}
const AddUser = ({ reloadMenu }: addUserProps) => {
  // const customPass = uuidv4().replace(/-/g, '');
  const inputRef = useRef(null);
  const [customPass, setCustomPass] = useState('');
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [newError, setNewError] = useState<string | null>(null);
  const [newSuccess, setNewSuccess] = useState('');
  const enterRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    role: '',
  });

  const selectRef = useRef<HTMLSelectElement>(null!);
  const dispatch = useAppDispatch();

  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    setCustomPass(uuidv4().replace(/-/g, ''));

    if (customPass)
      setFormData({ username: '', password: customPass, role: '' });

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  const getUser = async (username: string) => {
    const params = {
      TableName: import.meta.env.VITE_AWS_USER_TABLE,
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

  const createUser = async (item: iUser) => {
    updateCredentials();
    try {
      const dynamoUser = await getUser(item.username);
      if (dynamoUser && dynamoUser.username) {
        setNewError('Username already exists');
        setNewSuccess('');
        setCustomPass(uuidv4().replace(/-/g, ''));
        setFormData({ username: '', password: customPass, role: '' });
        reloadMenu();
        return;
      }

      const params = {
        TableName: import.meta.env.VITE_AWS_USER_TABLE,
        Item: item,
      };
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.put(params).promise();

      reloadMenu();
      setNewSuccess('You have successfully added a new User');
      setNewError(null);
      setCustomPass(uuidv4().replace(/-/g, ''));
      setFormData({ username: '', password: customPass, role: '' });
      selectRef.current.value = '0';
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        console.log('eve', event);
        if (enterRef.current != null) enterRef.current?.click();
      }
    },
    [formData]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, inputType: string) => {
      if (inputType === 'password') {
        setFormData({ ...formData, password: e.target.value });
      } else if (inputType === 'role') {
        setFormData({ ...formData, role: e.target.value });
      } else {
        setFormData({ ...formData, username: e.target.value });
      }
    },
    [formData]
  );

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>, inputType: string) => {
      if (inputType === 'password') {
        setFormData({ ...formData, password: e.target.value });
      } else if (inputType === 'role') {
        setFormData({ ...formData, role: e.target.value });
      } else {
        setFormData({ ...formData, username: e.target.value });
      }
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (
        formData.password == '' ||
        formData.username == '' ||
        formData.role == ''
      ) {
        setNewError('Everything is required!');
        setNewSuccess('');
      } else {
        createUser({
          id: uuidv4(),
          username: formData.username,
          password: await bcrypt.hash(formData.password, 10),
          role: formData.role,
          createdAt: new Date().toISOString(),
        });
        setFormData({ username: '', password: '', role: '' });
      }
    },
    [formData]
  );

  // const handleSubmit = useCallback(
  //   async (event: React.FormEvent<HTMLFormElement>) => {
  //     event?.preventDefault();
  //     console.log('event here');
  //   },
  //   [formData]
  // );

  const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      return dispatch(toggleAddUser());
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
        <div className='flex justify-between'>
          <h1 className='text-lg mb-4 text-'>Add New User</h1>
          <AiOutlineCloseCircle
            className='cursor-pointer hover:text-red-500'
            size={26}
            onClick={() => dispatch(toggleAddUser())}
          />
        </div>

        <div className='mb-3'>
          <label className='block text-gray-700 mb-2'>Category Name</label>
          <input
            className='border border-gray-400 p-2 rounded-lg w-full'
            type='text'
            ref={inputRef}
            value={formData.username}
            onChange={(e) => handleChange(e, 'username')}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className='mb-3'>
          <label className='block text-gray-700 mb-2'>Password</label>
          <input
            className='border border-gray-400 p-2 rounded-lg w-full'
            type='text'
            value={formData.password}
            onChange={(e) => handleChange(e, 'password')}
            onKeyDown={handleKeyDown}
            placeholder={customPass}
          />
          <button
            className={
              `bg-green-500 text-white p-2 gap-2 rounded-lg px-3 mt-2 mb-4  hover:bg-green-800 flex flex-grow text-sm ` +
              `${pageLoading ? 'disabled' : ''} `
            }
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              navigator.clipboard.writeText(formData.password);
              setNewSuccess('Password copied');
            }}
          >
            <BiCopy size={20} />
            Copy to Clipboard
          </button>
        </div>
        <div className='my-5 w-full'>
          Category
          <select
            defaultValue={0}
            className='form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out -m-0focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none hover:cursor-pointer mt-2'
            ref={selectRef}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleSelect(e, 'role')
            }
          >
            <option value='0' disabled>
              Select Category
            </option>
            {roles.length > 0 &&
              roles.map((role: string, index: number) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
          </select>
        </div>

        {newError && <ErrorComponent message={newError} />}
        {newSuccess.length > 1 && <SuccessComponent message={newSuccess} />}
        <div className='mb-3'>
          <button
            className={
              `bg-indigo-500 text-white p-3 rounded-lg px-5 hover:bg-indigo-800 float-right mt-2 disabled:bg-gray-600 ` +
              `${pageLoading ? 'disabled' : ''} `
            }
            disabled={pageLoading}
            ref={enterRef}
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
