import React, { useCallback, useEffect, useRef, useState } from 'react';

import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import AWS from 'aws-sdk';
import { toggleConfirmDelete } from '../../redux/popUpSlice';
import { updateCredentials } from '../../hooks/useDynamoDBData';
// import { s3 } from '../../aws/file';

interface deleteProdProps {
  currentData: any;
  reloadMenu: () => void;
}

const ConfirmPage = ({ currentData, reloadMenu }: deleteProdProps) => {
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

  const handleDeleteNum = async () => {
    const { id, createdAt } = currentData;
    updateCredentials();

    try {
      const params = {
        TableName: import.meta.env.VITE_AWS_CONTACT_TABLE,
        Key: {
          contactnum: currentData.contactnum,
        },
      };

      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.delete(params, async (err, data) => {
        if (err) {
          console.log(err);
        } else {
          dispatch(toggleConfirmDelete());
          setInitiate(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
    reloadMenu();
  };

  const handleDelete = async () => {
    const { id, createdAt } = currentData;
    updateCredentials();

    try {
      const params = {
        TableName: import.meta.env.VITE_AWS_MENU_TABLE,
        Key: {
          id: id,
          createdAt: createdAt,
        },
      };

      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.delete(params, async (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const s3 = new AWS.S3({ apiVersion: '2021-08-06' });

          const params = {
            Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
            Key: `menu/${currentData.img_Url}`,
          };

          await s3.deleteObject(params, (err, data) => {
            if (err) {
              console.log(err, err.stack);
            } else {
              dispatch(toggleConfirmDelete());
              setInitiate(false);
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
    reloadMenu();
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
            Do you really want to delete{' '}
            <p>
              "
              {currentData.contactnum
                ? currentData.contactnum
                : currentData.name}
              "
            </p>
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
          onClick={currentData.contactnum ? handleDeleteNum : handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmPage;
