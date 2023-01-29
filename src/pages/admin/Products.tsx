// import React, { useState } from 'react';

import { useEffect, useState } from 'react';
import { getFileParams, s3 } from '../../aws/file';
import SideBar from '../../components/common/SideBar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  toggleProd,
  toggleCategory,
  toggleUpload,
} from '../../redux/popUpSlice';
import AddCategory from './popups/AddCategory';
import AddProduct from './popups/AddProd';
import UploadMenu from './popups/UploadMenu';

const sampleProd = [
  'beef',
  'fish',
  'chicken',
  'soup',
  'pasta',
  'vegetables',
  'drinks',
  'appetizer',
  'pork',
  'beef',
  'robot',
];

//TODO layout for product list with delete and edit button
//TODO create button for
// !! get sidebar open status to make the row wider

const Products = () => {
  const prodIsOpen = useAppSelector((state) => state.toggling.prodIsOpen);
  const categIsOpen = useAppSelector((state) => state.toggling.categoryIsOpen);
  const uploadIsOpen = useAppSelector((state) => state.toggling.uploadIsOpen);
  const dispatch = useAppDispatch();
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    try {
      const imgUrl = s3.getSignedUrl('getObject', {
        ...getFileParams,
        Key: 'menu/1674979180013-beef.jpg',
      });
      if (imgUrl) {
        setImageURL(imgUrl);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      {uploadIsOpen && <UploadMenu />}
      {categIsOpen && <AddCategory />}
      {prodIsOpen && <AddProduct />}
      <section className='flex overflow-hidden w-full justify-center'>
        <SideBar />
        <div
          className={`mx-auto m-1 mt-4  flex flex-col max-w-2xl text-xl text-gray-900 font-semibold xl:max-w-full sm:max-w-[66%] xs:max-w-[55%] md:max-w-[76%] `}
        >
          <div className='ml-2 mt-3'>
            <h1>Hi Name!</h1>
          </div>
          <div className='flex justify-end items-center flex-row w-full mt-5 p-1'>
            <div className='xs:text-sm font-light sm:text-base flex overflow-auto'>
              <button
                className='bg-yellow-500 p-1 px-2 rounded-lg'
                onClick={() => dispatch(toggleUpload())}
              >
                Upload Menu
              </button>
              <button
                className='bg-green-700 text-white p-1 px-2 rounded-lg mx-2'
                onClick={() => dispatch(toggleCategory())}
              >
                Category+
              </button>
              <button
                className='bg-green-700 text-white p-1 px-2 rounded-lg'
                onClick={() => dispatch(toggleProd())}
              >
                Product+
              </button>
            </div>
          </div>

          <div className='mt-4 pb-2 overflow-auto'>
            <ul className='mt-3 flex flex-col gap-3'>
              <li className='flex flex-row grow w-auto justify-between items-center overflow-auto h-20 gap-4'>
                <div className='min-w-[20%]'>Image</div>
                <div className='min-w-[25%]'>Name here</div>
                <div className='min-w-[10%]'>Price</div>
                <div className='min-w-[20%]'>category</div>
                <div className='flex flex-row gap-4 min-w-[20%]'>Actions</div>
              </li>
              <li className='flex flex-row grow w-auto justify-between items-center overflow-auto h-20 gap-4 text-center'>
                {/*//! Image / Name / Price / category */}
                <img
                  src={imageURL}
                  alt='itemname'
                  width='100'
                  height='100'
                  className='min-w-[20%]'
                />
                <div className='min-w-[25%]'>Name here</div>{' '}
                <div className='min-w-[10%]'>Price</div>{' '}
                <div className='min-w-[20%]'>category</div>
                <div className='flex flex-row gap-4 min-w-[20%]'>
                  <button className='bg-yellow-500 p-1 px-2 rounded-lg'>
                    edit
                  </button>
                  <button className='bg-red-500 p-1 px-2 rounded-lg'>
                    delete
                  </button>
                </div>
              </li>
            </ul>
            <ul className='mt-3 flex flex-row gap-4 overflow-y-auto py-2 text-sm px-2'>
              {sampleProd.map((item: string, index: number) => (
                <li
                  className='px-4 py-2 bg-gray-800 rounded-full text-white'
                  key={index}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
