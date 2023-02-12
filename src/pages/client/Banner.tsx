import React, { useState } from 'react';
import chef from '/images/Hannah.jpg';
import about from '../../../data/about.json';

type Props = {
  onClick: (e: React.MouseEvent<HTMLOrSVGElement>) => void;
};

const Banner = (props: Props) => {
  const data = about;

  return (
    <section className=' flex justify-center'>
      <div className='banner flex border-solid border-blue-250 border-8 sm:p-0 rounded-2xl justify-evenly self-center flex-wrap content-center '>
        <div className='w-full flex justify-end'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='hover:bg-blue-250 hover:text-white rounded-full cursor-pointer h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            onClick={props.onClick}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </div>
        <div className='md:w-3/12 w-full h-full self-start flex flex-wrap justify-center p-2 flex-col'>
          <img
            src={chef}
            alt='Logo'
            className='flex self-center chef mb-4 w-auto rounded-xl'
          />
          <h3 className='text-red-250 text-sm'>Chef</h3>
          <h3 className='text-red-250'>Hannah Herrera-Bagatsing</h3>
        </div>
        <div className='flex flex-grow flex-wrap w-6/12 px-4 text-justify pb-2'>
          {data.about.map((item, index) => (
            <p
              key={index}
              className='flex flex-grow about-text py-2 w-full text-xs'
            >
              {Object.values(item)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
