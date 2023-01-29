import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleProd } from '../../../redux/popUpSlice';
import isEmpty from '../../../validator/is-empty';
import ErrorComponent from '../../../components/common/Error';

interface ProductFormData {
  name: string;
  description: string;
  img_url: string;
  price: string;
  category_id: string;
}

//TODO - when a file is uploaded make a query to post in dynamo as well.
//TODO - Make a post query to store data in dynamodb
//TODO - update redux storage for products list

const AddProduct = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    img_url: '',
    price: '',
    category_id: '',
  });

  const [newError, setNewError] = useState(false);
  const [errorMsg, setNewErrorMsg] = useState('');

  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEmpty(formData.category_id)) console.log('formData', formData);

    const filtered = Object.entries(formData).filter(([key, value]) =>
      isEmpty(value)
    );

    console.log('filtered', filtered);

    try {
      if (filtered.length !== 0) {
        setNewErrorMsg('Everything is required!');
        return setNewError(true);
      }

      setNewError(false);
      dispatch(toggleProd());
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement | EventTarget>
  ) => {
    const result = (e.target as HTMLInputElement).files;
    if (result?.length) {
      setFormData({
        ...formData,
        img_url: result[0].name,
      });
    }
  };

  return (
    <div className='bg-gray-900 bg-opacity-80 flex content-center items-center justify-center fixed w-full h-full z-10'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md  min-w-4/5'
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
                className='form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out -m-0focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none hover:cursor-pointer'
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
              >
                <option value='0' disabled>
                  Select Category
                </option>
                <option value='1'>Beef</option>
                <option value='2'>Chicken</option>
                <option value='3'>Pasta</option>
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
          />

          <p className='mt-1 text-sm text-gray-900'>
            SVG, PNG, JPG or GIF (MAX. 600x400px).
          </p>
        </div>

        {newError && <ErrorComponent message={errorMsg} />}

        <button className='bg-blue-550 text-white p-3 rounded-lg hover:bg-indigo-600 float-right'>
          AddProduct
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
