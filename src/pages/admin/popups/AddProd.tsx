import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleProd } from '../../../redux/popUpSlice';
import ErrorComponent from '../../../components/common/Error';
import {
  updateCredentials,
  useDynamoCategories,
} from '../../../hooks/useDynamoDBData';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { iCategory, iProduct } from '../../../constant/interface';
import { fileParams, s3 } from '../../../aws/file';
import SuccessComponent from '../../../components/common/Success';
import { config } from '../../../config';

//TODO - when a file is uploaded make a query to post in dynamo as well.
//TODO - Make a post query to store data in dynamodb
//TODO - update redux storage for products list

interface iFormData {
  name: string;
  description: string;
  price: string;
  img_Url: string;
  category_id: string;
}

interface addProdProps {
  reloadMenu: (arg: iProduct, taskDone: string) => void;
}

const AddProduct = ({ reloadMenu }: addProdProps) => {
  const [formData, setFormData] = useState<iFormData>({
    name: '',
    description: '',
    price: '',
    img_Url: '',
    category_id: '',
  });

  const [newError, setNewError] = useState(false);
  const [errorMsg, setNewErrorMsg] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newSuccess, setNewSuccess] = useState('');
  const fileRef = useRef<HTMLInputElement>(null!);
  const selectRef = useRef<HTMLSelectElement>(null!);

  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  const createNewProduct = async (data: iFormData) => {
    updateCredentials();

    const newData = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    try {
      const params = {
        TableName: config.aws_menu,
        Item: newData,
      };

      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.put(params).promise();

      if (image) {
        setUploading(true);
        const keyName = `menu/${image.name}`;
        fileParams.Key = keyName;
        fileParams.Body = image;
        try {
          await s3.upload(fileParams, (err: Error, data: any) => {
            if (err) {
              console.log(err);
            } else {
              fileRef.current.value = '';
              selectRef.current.value = '0';
              setUploading(false);
              reloadMenu(newData, 'addProduct');
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data } = useDynamoCategories(config.aws_category);

  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (Object.values(formData).some((value) => !value)) {
        setNewErrorMsg('Everything is required!');
        setNewSuccess('');
        return setNewError(true);
      } else {
        createNewProduct(formData);
        setNewError(false);
        setNewSuccess(`You have Successfully added ${formData.name}`);
        setFormData({
          name: '',
          description: '',
          price: '',
          img_Url: '',
          category_id: '',
        });

        //! dispatch prod details in redux
        // dispatch(toggleProd());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement | EventTarget>
  ) => {
    const result = (e.target as HTMLInputElement).files;
    if (result?.length) {
      setImage(result[0]);
      setFormData({
        ...formData,
        img_Url: result[0].name,
      });
    }
  };

  const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      return dispatch(toggleProd());
    }
  };

  return (
    <div
      className={
        `bg-gray-900 bg-opacity-80 flex xs:text-sm md:text-base content-center items-center justify-center fixed w-full h-full z-30 backdrop-blur-sm transition-opacity duration-500 ${
          initiate && ' opacity-100 '
        }` + `${!initiate && ' opacity-0'}`
      }
      onClick={closeForm}
    >
      <form
        onSubmit={handleSubmit}
        className={
          `bg-white p-6 rounded-lg shadow-md xs:min-w-[50%] md:min-w-[30%] transition-transform duration-500 ${
            initiate && ' translate-y-0 '
          }` + `${!initiate && ' -translate-y-10'}`
        }
      >
        <div className='flex justify-between'>
          <h1 className='text-lg mb-4 text-'>Add New Product</h1>
          <AiOutlineCloseCircle
            className='cursor-pointer hover:text-red-500'
            size={26}
            onClick={() => dispatch(toggleProd())}
          />
        </div>

        <div className='mb-3'>
          <label className='block text-gray-700 mb-2'>Product Name</label>
          <input
            className='border border-gray-400 p-2 rounded-lg w-full'
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className='mb-1'>
          <label className='block text-gray-700 mb-2'>Category</label>
          <div className='flex w-full'>
            <div className='mb-3 w-full'>
              <select
                defaultValue={0}
                ref={selectRef}
                className='form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out -m-0focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none hover:cursor-pointer'
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
              >
                <option value='0' disabled>
                  Select Category
                </option>
                {data.length > 0 &&
                  data.map((category: iCategory, index: number) => (
                    <option key={index} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className='mb-3'>
          <label className='block text-gray-700 mb-2'>Price</label>
          <input
            className='border border-gray-400 p-2 rounded-lg w-full'
            type='text'
            value={formData.price}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value)))
                setFormData({
                  ...formData,
                  price: e.target.value,
                });
            }}
          />
        </div>

        <div className='mb-3'>
          <label className='block text-gray-700 mb-2'>Description</label>
          <textarea
            className='border border-gray-400 p-2 rounded-lg w-full resize-none'
            rows={3}
            cols={30}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className='mb-3'>
          <input
            className=' block w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 file:bg-gray-600 file:border-0 file:cursor-pointer file:text-white file:p-2 file:rounded-tl-lg file:rounded-bl-md file:px-4'
            type='file'
            onChange={handleUpload}
            accept={'image/*'}
            ref={fileRef}
          />

          <p className='mt-1 text-sm text-gray-900'>
            SVG, PNG, JPG or GIF (MAX. 600x400px).
          </p>
        </div>

        {newError && <ErrorComponent message={errorMsg} />}
        {newSuccess.length > 1 && <SuccessComponent message={newSuccess} />}
        <button
          className='bg-indigo-500 text-white p-3 mt-2 px-5 rounded-lg hover:bg-indigo-800 float-right disabled:bg-gray-500'
          disabled={uploading}
        >
          AddProduct
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
