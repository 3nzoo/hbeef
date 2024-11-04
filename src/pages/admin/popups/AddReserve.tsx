import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ErrorComponent from '../../../components/common/Error';
import SuccessComponent from '../../../components/common/Success';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleReserve } from '../../../redux/popUpSlice';
import { v4 as uuidv4 } from 'uuid';
import { updateCredentials } from '../../../hooks/useDynamoDBData';
import { iReserver } from '../../../constant/interface';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { config } from '../../../config';

import { BiCopy } from 'react-icons/bi';
import AWS from 'aws-sdk';

const roles = ['staff', 'editor', 'assistant'];

interface ReserveFormData {
  date: Date | null;
  description: string;
}
interface addReserveProps {
  excludeDates: Date[];
  reloadMenu: () => void;
}

const AddReserve = ({ excludeDates, reloadMenu }: addReserveProps) => {
  // const customPass = uuidv4().replace(/-/g, '');

  const inputRef = useRef(null);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [newError, setNewError] = useState<string | null>(null);
  const [newSuccess, setNewSuccess] = useState('');
  const enterRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState<ReserveFormData>({
    date: new Date(),
    description: '',
  });

  // const selectRef = useRef<HTMLSelectElement>(null!);
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

  const createReserve = async (item: iReserver) => {
    updateCredentials();
    try {
      const params = {
        TableName: config.aws_dateTable,
        Item: item,
      };
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.put(params).promise();

      console.log('item', item);
      reloadMenu();
      setNewSuccess('You have successfully added a new restricted date');
      setNewError(null);
      setFormData({ date: new Date(), description: '' });
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
      setFormData({ ...formData, description: e.target.value });
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (formData.date == null || formData.description == '') {
        setNewError('Everything is required!');
        setNewSuccess('');
      } else {
        createReserve({
          id: uuidv4(),
          date: formData.date.toISOString(),
          description: formData.description,
          createdAt: new Date().toISOString(),
        });
        setFormData({ date: null, description: '' });
      }
    },
    [formData]
  );

  const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      return dispatch(toggleReserve());
    }
  };

  return (
    <div
      className={
        `bg-gray-900 bg-opacity-80 flex content-center items-start justify-center fixed w-full h-full z-30 backdrop-blur-sm transition-opacity duration-500 ${
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
          <h1 className='text-lg mb-4 text-'>Add New Restricted Date</h1>
          <AiOutlineCloseCircle
            className='cursor-pointer hover:text-red-500'
            size={26}
            onClick={() => dispatch(toggleReserve())}
          />
        </div>

        <div className='mb-5 flex flex-col justify-center items-center'>
          <label className='block text-gray-700 mb-2 mr-3'>Date:</label>
          <DatePicker
            className='border-2 '
            selected={formData.date}
            onChange={(dateNow: any) => {
              setFormData({ ...formData, date: dateNow });
            }}
            excludeDates={excludeDates}
            inline
          />
        </div>
        <div className='mb-3'>
          <label className='block text-gray-700 mb-2'>Description</label>
          <input
            className='border border-gray-400 p-2 rounded-lg w-full'
            type='text'
            ref={inputRef}
            value={formData.description}
            onChange={(e) => handleChange(e, 'username')}
            onKeyDown={handleKeyDown}
          />
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
            Add Restricted Date
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReserve;
