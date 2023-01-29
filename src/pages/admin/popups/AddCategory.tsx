import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleCategory, toggleProd } from '../../../redux/popUpSlice';
import isEmpty from '../../../validator/is-empty';
import ErrorComponent from '../../../components/common/Error';
import SuccessComponent from '../../../components/common/Success';

const categoryList = [
  'Beef',
  'Fish',
  'Pasta',
  'Chicken',
  'Appetizer',
  'Drinks',
  'Pasta',
  'Chicken',
  'Appetizer',
  'Drinks',
  'Pasta',
  'Chicken',
  'Appetizer',
  'Drinks',
  'Pasta',
  'Chicken',
  'Appetizer',
  'Drinks',
  'Pasta',
  'Chicken',
  'Appetizer',
  'Drinks',
  'Pasta',
  'Chicken',
  'Appetizer',
  'Drinks',
];

interface CategoryFormData {
  name: string;
}

const AddCategory = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
  });

  const [newError, setNewError] = useState(false);
  const [errorMsg, setNewErrorMsg] = useState('');
  const [newSuccess, setNewSuccess] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEmpty(formData.name)) console.log('formData', formData);

    const filtered = Object.entries(formData).filter(([key, value]) =>
      isEmpty(value)
    );

    console.log('filtered', filtered);

    try {
      if (filtered.length !== 0) {
        setNewErrorMsg('Category Name is required! Please try again');
        setNewSuccess(false);
        return setNewError(true);
      }

      categoryList.push(formData.name);
      setNewError(false);
      setNewSuccess(true);
      setFormData({ ...formData, name: '' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='bg-gray-900 bg-opacity-80 flex content-center items-center justify-center fixed w-full h-full z-10'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md min-w-[25%]'
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className='mb-1'>
          <label className='block text-gray-700 mb-2'>
            Existing Categories
          </label>
          <div className='flex w-full'>
            <div className='mb-3 w-full'>
              <div className='h-full w-full'>
                <select
                  defaultValue={0}
                  size={5}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 min-h-60'
                >
                  <option value={0}>- Category List -</option>
                  {categoryList.map((category: string, index: number) => (
                    <option
                      className='disabled: text-white'
                      disabled
                      key={index}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {newError && <ErrorComponent message={errorMsg} />}
        {newSuccess && (
          <SuccessComponent message='You have successfully added new category' />
        )}

        <button className='bg-blue-550 text-white p-3 rounded-lg hover:bg-indigo-600 float-right mt-5'>
          AddCategory
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
