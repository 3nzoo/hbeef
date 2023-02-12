import React, { useCallback, useEffect, useRef, useState } from 'react';

import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import AWS from 'aws-sdk';
import { toggleConfirmDelete } from '../../redux/popUpSlice';
import { updateCredentials } from '../../hooks/useDynamoDBData';
// import { s3 } from '../../aws/file';

interface deleteProps {
  currentData: any;
  reloadMenu: (arg: any, taskDone: string) => void;
}

const ConfirmDelete = ({ currentData, reloadMenu }: deleteProps) => {
  let displayData = '';
  let currentTable = '';

  if (currentData.date) {
    currentTable = import.meta.env.VITE_AWS_DATE_TABLE;
    displayData = currentData.description;
  } else if (currentData.username) {
    displayData = currentData.username;
    currentTable = import.meta.env.VITE_AWS_USER_TABLE;
  }

  const enterRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, []);

  const handleDelete = async () => {
    const { username } = currentData;
    updateCredentials();

    try {
      const params = {
        TableName: currentTable,
        Key: {
          username,
        },
      };
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.delete(params, async (err, data) => {
        if (err) {
          console.log(err);
        } else {
          reloadMenu(username, 'delete');
          dispatch(toggleConfirmDelete());
          setInitiate(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      return dispatch(toggleConfirmDelete());
    }
  };

  return (
    // overlay //
    <div
      className={
        `bg-gray-900 bg-opacity-80 flex content-center items-center justify-center fixed w-full h-full backdrop-blur-sm z-30 transition-opacity duration-500 ${
          initiate && ' opacity-100 '
        }` + `${!initiate && ' opacity-0'}`
      }
      onClick={closeForm}
    >
      {/* modal */}
      <div
        className={
          `bg-white p-4 rounded-lg shadow-md xs:min-w-[40%] md:min-w-[20%] transition-transform duration-500 ${
            initiate && ' translate-y-0 '
          }` + `${!initiate && ' -translate-y-10'}`
        }
      >
        <AiOutlineCloseCircle
          className='cursor-pointer hover:text-red-500 float-right'
          size={26}
          onClick={() => dispatch(toggleConfirmDelete())}
        />
        <div className='flex justify-between mt-10'>
          <h1 className='text-lg my-5 text-center mx-auto'>
            Do you really want to delete <p>"{displayData}"</p>
          </h1>
        </div>
        <button
          className={`bg-gray-600 text-white p-2 ml-2 px-3 rounded-lg hover:bg-gray-900 float-right mt-5 `}
          onClick={() => dispatch(toggleConfirmDelete())}
        >
          Cancel
        </button>
        <button
          className={`bg-red-700 text-white p-2 px-3 rounded-lg hover:bg-red-900 float-right mt-5 `}
          ref={enterRef}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
