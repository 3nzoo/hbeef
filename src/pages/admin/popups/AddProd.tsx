import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleProd } from '../../../redux/popUpSlice';

interface ProductFormData {
  name: string;
  description: string;
  img_url: string;
  price: string;
  category_id: string;
}

// interface Errors {
//   name?: string;
//   description?: string;
//   general?: string;
// }

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    img_url: '',
    price: '',
    category_id: '',
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      navigate('/admin');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='bg-gray-900 bg-opacity-80 flex content-center items-center justify-center fixed w-full h-full z-10 '>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md  min-w-4/5'
      >
        <div className='flex justify-between'>
          <h2 className='text-lg mb-4'>Add New Product</h2>
          <AiOutlineCloseCircle
            size={26}
            className='cursor-pointer '
            onClick={() => dispatch(toggleProd())}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>Product Name</label>
          <input
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`border border-gray-400 p-2 rounded-lg w-full `}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>Price</label>
          <input
            type='text'
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className={`border border-gray-400 p-2 rounded-lg w-full `}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>Description</label>
          <textarea
            rows={3}
            cols={30}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`border border-gray-400 p-2 rounded-lg w-full `}
          />
        </div>
        <div className='mb-4'>
          <button className='bg-gray-800 text-white p-2 rounded-lg'>
            Upload Image
          </button>
        </div>

        <button className='bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600'>
          AddProduct
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
