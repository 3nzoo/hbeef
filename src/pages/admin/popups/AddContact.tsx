import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ErrorComponent from '../../../components/common/Error';
import SuccessComponent from '../../../components/common/Success';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleAddContact } from '../../../redux/popUpSlice';
import { v4 as uuidv4 } from 'uuid';
import { updateCredentials } from '../../../hooks/useDynamoDBData';
import AWS from 'aws-sdk';

const roles = ['staff', 'editor', 'assistant'];

interface ContactsFormData {
  contactnum: string;
}
interface addContactsProps {
  reloadMenu: () => void;
}
const AddContacts = ({ reloadMenu }: addContactsProps) => {
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [newError, setNewError] = useState<string | null>(null);
  const [newSuccess, setNewSuccess] = useState('');
  const enterRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState<ContactsFormData>({
    contactnum: '',
  });
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

  const getContact = async (contactnum: string) => {
    const params = {
      TableName: import.meta.env.VITE_AWS_CONTACT_TABLE,
      Key: {
        contactnum,
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

  const createContact = async (item: any) => {
    updateCredentials();
    try {
      const dynamoUser = await getContact(item.contactnum);
      if (dynamoUser && dynamoUser.contactnum) {
        setNewError('Contact Number already exists');
        setNewSuccess('');
        return;
      }

      const params = {
        TableName: import.meta.env.VITE_AWS_CONTACT_TABLE,
        Item: item,
      };

      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.put(params).promise();

      reloadMenu();
      setNewSuccess('You have successfully added a new number');
      setNewError(null);

      setFormData({ contactnum: '' });
    } catch (error) {
      console.log('error', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPageLoading(true);
      let sendingData = formData.contactnum;

      if (
        formData.contactnum === '' ||
        !formData ||
        formData.contactnum === null
      ) {
        setNewSuccess('');
        return setNewError('Contact Number is Required');
      }

      if (formData.contactnum.substring(0, 2) === '63') {
        sendingData = sendingData.replace(/^(.{5})(.{3})/, '$1-$2-').toString();
      } else if (formData.contactnum.substring(0, 3) === '028') {
        sendingData = sendingData.replace(/^(.{2})(.{4})/, '$1-$2-').toString();
      } else if (
        formData.contactnum.substring(0, 1) === '8' ||
        formData.contactnum.substring(0, 1) === '3' ||
        formData.contactnum.substring(0, 1) === '7'
      ) {
        sendingData = sendingData.replace(/^(.{1})(.{3})/, '$1-$2-').toString();
      } else {
        sendingData = sendingData.replace(/^(.{4})(.{3})/, '$1-$2-').toString();
      }

      createContact({
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        contactnum: sendingData,
        isDefault: false,
      });
      setFormData({ contactnum: '' });
    },
    [formData]
  );

  const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      return dispatch(toggleAddContact());
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
          <h1 className='text-lg mb-4 text-'>Add New Contact Number</h1>
          <AiOutlineCloseCircle
            className='cursor-pointer hover:text-red-500'
            size={26}
            onClick={() => dispatch(toggleAddContact())}
          />
        </div>

        <div className='mb-3'>
          <label className='block text-gray-700 mb-2'>Number:</label>
          <input
            className='border border-gray-400 p-2 rounded-lg w-full'
            type='text'
            maxLength={12}
            minLength={8}
            value={formData.contactnum}
            placeholder={'12 numbers max'}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value)))
                setFormData({
                  ...formData,
                  contactnum: e.target.value,
                });
            }}
          />
        </div>
        {newError && <ErrorComponent message={newError} />}
        {newSuccess.length > 1 && <SuccessComponent message={newSuccess} />}
        <div className='mb-3'>
          <button
            className={
              `bg-indigo-500 text-white p-3 rounded-lg px-5 hover:bg-indigo-800 float-right mt-5  disabled:bg-gray-600 ` +
              `${pageLoading ? 'disabled' : ''} `
            }
            ref={enterRef}
            disabled={pageLoading}
          >
            Add Number
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContacts;
