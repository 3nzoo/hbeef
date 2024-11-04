import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleCategory } from '../../../redux/popUpSlice';
import isEmpty from '../../../validator/is-empty';
import ErrorComponent from '../../../components/common/Error';
import SuccessComponent from '../../../components/common/Success';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { iCategory } from '../../../constant/interface';
import {
  updateCredentials,
  useDynamoCategories,
} from '../../../hooks/useDynamoDBData';
import { config } from '../../../config';

interface CategoryFormData {
  name: string;
}

const AddCategory = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
  });
  const { data, loading } = useDynamoCategories(config.aws_category);

  const inputRef = useRef(null);

  const [pageLoading, setPageLoading] = useState<boolean>(loading);
  const [newError, setNewError] = useState<string | null>(null);
  const [newSuccess, setNewSuccess] = useState('');
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
  }, [initiate]);

  const deleteCategory = async (
    categoryId: any,
    createDate: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    updateCredentials();
    try {
      const params = {
        TableName: config.aws_category,
        Key: {
          id: categoryId,
          createdAt: createDate,
        },
      };
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.delete(params).promise();
      const index = await data.findIndex(
        (item: any) => item.id === categoryId && item.createdAt === createDate
      );
      data.splice(index, 1);
      setFormData({ ...formData, name: '' });
      setNewError(null);
      setNewSuccess('you have successfully deleted a category Item');
    } catch (error) {
      console.log(error);
    }
  };

  const createCategory = async (item: iCategory) => {
    updateCredentials();
    try {
      const params = {
        TableName: config.aws_category,
        Item: item,
      };
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.put(params).promise();

      // categoryList.push(formData.name);

      data.unshift(item);
      setFormData({ ...formData, name: '' });
      setNewSuccess('You have successfully added a new category');
      // dispatch(addCategory({ formData }));
    } catch (error) {
      console.log('error', error);
    }
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, name: e.target.value });
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const filtered = Object.entries(formData).filter(([key, value]) =>
        isEmpty(value)
      );

      if (filtered.length !== 0) {
        setNewError('Category Name is required!');
        setNewSuccess('');
      } else {
        createCategory({
          id: uuidv4(),
          name: formData.name,
          createdAt: new Date().toISOString(),
        });

        setFormData({ name: '' });
      }
    },
    [formData]
  );

  const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      return dispatch(toggleCategory());
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
          <h1 className='text-lg mb-4 text-'>Add New Category</h1>
          <AiOutlineCloseCircle
            className='cursor-pointer hover:text-red-500'
            size={26}
            onClick={() => dispatch(toggleCategory())}
          />
        </div>

        <div className='mb-3'>
          <label className='block text-gray-700 mb-2'>Category Name</label>
          <input
            className='border border-gray-400 p-2 rounded-lg w-full'
            type='text'
            ref={inputRef}
            value={formData.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <label className='p-2 block text-gray-700 mb-0 text-lg font-bold text-center'>
          Existing Categories
        </label>
        <div className='mb-3 border border-gray-800 overflow-auto h-80'>
          <div className='flex w-full'>
            <div className='h-full w-full'>
              {pageLoading ? (
                <div>Loading...</div>
              ) : (
                <table className='w-full border-1 border-gray-200'>
                  <thead className='sticky top-0 bg-white border h-12'>
                    <tr className='text-sm font-medium text-gray-700 border border-gray-200 '>
                      <td className='px-3 text-center border border-gray-200'>
                        <span>Category Name</span>
                      </td>
                      <td className='px-3 text-center'>
                        <span>Action</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 &&
                      data.map((category: iCategory, index: number) => (
                        <tr className='border-b border-gray-200' key={index}>
                          <td className='text-center backdrop:gap-x-4'>
                            <span>{category.name}</span>
                          </td>
                          <td className='text-center'>
                            <button
                              className=' xs:text-xs md:text-sm p-2 m-3 hover:rounded-md hover:bg-red-800 bg-red-600 text-white rounded-lg'
                              onClick={(e) => {
                                deleteCategory(
                                  category.id,
                                  category.createdAt,
                                  e
                                );
                              }}
                            >
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        {newError?.length && <ErrorComponent message={newError} />}
        {newSuccess.length > 1 && <SuccessComponent message={newSuccess} />}

        <button
          className={
            `bg-indigo-500 text-white p-3 rounded-lg px-5 hover:bg-indigo-800 float-right mt-1 ` +
            `${pageLoading ? 'disabled' : ''} `
          }
          ref={enterRef}
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
