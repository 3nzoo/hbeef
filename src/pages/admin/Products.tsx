// import React, { useState } from 'react';
import SideBar from '../../components/common/SideBar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleProd } from '../../redux/popUpSlice';
import { toggle } from '../../redux/sidebarSlice';
import AddProduct from './popups/AddProd';

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
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const prodIsOpen = useAppSelector((state) => state.toggling.prodIsOpen);
  const dispatch = useAppDispatch();
  return (
    <>
      {prodIsOpen && <AddProduct />}
      <section className='flex overflow-hidden w-full justify-center'>
        <SideBar />
        <div
          className={
            `mx-auto m-1 mt-4  flex flex-col max-w-2xl text-xl text-gray-900 font-semibold xl:max-w-full ` +
            `${
              isOpen
                ? 'sm:max-w-[66%] xs:max-w-[55%] md:max-w-[76%] '
                : 'sm:max-w-[80%] xs:max-w-[70%] md:max-w-[85%] '
            }`
          }
        >
          <div className='flex justify-between items-center flex-row w-full mt-5 p-1'>
            <h1>Hi Name!</h1>
            <div className='text-md font-light text-base flex overflow-auto'>
              <button className='bg-yellow-500 p-1 px-2 rounded-lg mx-2'>
                Category+
              </button>
              <button
                className='bg-green-500 p-1 px-2 rounded-lg'
                onClick={() => dispatch(toggleProd())}
              >
                Product+
              </button>
            </div>
          </div>

          <div className='pb-2 overflow-auto'>
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
