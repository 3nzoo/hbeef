import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleEditProd, toggleProd } from '../../../redux/popUpSlice';
import ErrorComponent from '../../../components/common/Error';
import {
  updateCredentials,
  useDynamoCategories,
} from '../../../hooks/useDynamoDBData';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { iCategory, iProduct } from '../../../../constant/interface';
import { fileParams, s3 } from '../../../aws/file';
import SuccessComponent from '../../../components/common/Success';

//TODO - when a file is uploaded make a query to post in dynamo as well.
//TODO - Make a post query to store data in dynamodb
//TODO - update redux storage for products list

interface iFormData {
  id: string;
  name: string;
  description: string;
  price: string;
  img_Url: string;
  category_id: string;
  createdAt: string;
}

interface editProdProps {
  currentData: any;
  reloadMenu: (arg: iProduct, taskDone: string) => void;
}

const EditProduct = ({ currentData, reloadMenu }: editProdProps) => {
  const [formData, setFormData] = useState(currentData);

  const [newError, setNewError] = useState(false);
  const [errorMsg, setNewErrorMsg] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newSuccess, setNewSuccess] = useState('');
  const dispatch = useAppDispatch();
  const { data } = useDynamoCategories(import.meta.env.VITE_AWS_CATEGORY_TABLE);
  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 100);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  const editProduct = async (data: iFormData) => {
    updateCredentials();
    try {
      const dynamodb = new AWS.DynamoDB.DocumentClient({
        region: import.meta.env.VITE_AWS_REGION,
      });
      // await dynamodb.update(params).promise();
      await dynamodb
        .update({
          TableName: import.meta.env.VITE_AWS_MENU_TABLE,
          Key: { id: data.id, createdAt: data.createdAt },
          UpdateExpression:
            'SET #name = :name, #description = :description, #price = :price, #img_Url = :img_Url, #category_id = :category_id',
          ExpressionAttributeNames: {
            '#name': 'name',
            '#description': 'description',
            '#price': 'price',
            '#img_Url': 'img_Url',
            '#category_id': 'category_id',
          },
          ExpressionAttributeValues: {
            ':name': data.name,
            ':description': data.description,
            ':price': data.price,
            ':img_Url': data.img_Url,
            ':category_id': data.category_id,
          },
        })
        .promise();
      reloadMenu(data, 'editProduct');

      if (image) {
        const keyName = `menu/${image.name}`;
        setUploading(true);
        fileParams.Key = keyName;
        fileParams.Body = image;
        try {
          await s3.upload(fileParams).promise();
          setUploading(false);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (Object.values(formData).some((value) => !value)) {
        setNewErrorMsg('Everything is required!');
        setNewSuccess('');
        return setNewError(true);
      } else {
        editProduct(formData);
        setNewError(false);
        setNewSuccess(`You have Successfully edited ${formData.name}`);
        setFormData({
          id: '',
          name: '',
          description: '',
          price: '',
          img_Url: '',
          category_id: '',
          createdAt: '',
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
      return dispatch(toggleEditProd());
    }
  };

  return (
    <div
      className={
        `bg-gray-900 bg-opacity-80 xs:text-sm md:text-base flex content-center items-center justify-center fixed w-full h-full z-30 backdrop-blur-sm transition-opacity duration-500 ${
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
          <h1 className='text-lg mb-4 text-'>Edit Product</h1>
          <AiOutlineCloseCircle
            className='cursor-pointer hover:text-red-500'
            size={26}
            onClick={() => dispatch(toggleEditProd())}
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
                defaultValue={data.category_id}
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
          Update Image
          <input
            className='mt-2 block w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 file:bg-gray-600 file:border-0 file:cursor-pointer file:text-white file:p-2 file:rounded-tl-lg file:rounded-bl-md file:px-4'
            type='file'
            onChange={handleUpload}
            accept={'image/*'}
            placeholder='hello'
          />
          <p className='mt-1 text-sm text-gray-900'>
            SVG, PNG, JPG or GIF (MAX. 600x400px).
          </p>
        </div>

        {newError && <ErrorComponent message={errorMsg} />}
        {newSuccess.length > 1 && <SuccessComponent message={newSuccess} />}
        <button
          className='bg-indigo-600 text-white p-3 rounded-lg px-5 mt-5 hover:bg-indigo-800 float-right'
          disabled={uploading}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
