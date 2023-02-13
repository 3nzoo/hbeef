import React, { useEffect, useState } from 'react';
import chef from '../../assets/Hannah.jpg';
import about from '../../../data/about.json';

type Props = {
  onClick: (e: React.MouseEvent<HTMLOrSVGElement>) => void;
};

const Banner = (props: Props) => {
  const data = about;

  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  return (
    <section
      className={
        `flex justify-center mb-10 xs:-mt-40 md:mt-0 bg-white bg-opacity-60 mx-3 rounded-2xl max-w-[900px] z-30 backdrop-blur-sm transition-opacity duration-500 ${
          initiate && ' opacity-100 '
        }` + `${!initiate && ' opacity-0'}`
      }
    >
      <div
        className={
          `banner flex border-solid border-blue-250 border-8 sm:p-0 rounded-2xl justify-evenly self-center flex-wrap content-center transition-transform duration-500 ${
            initiate && ' translate-y-0 '
          }` + `${!initiate && ' -translate-y-10'}`
        }
      >
        <div className='w-full p-2 flex justify-end'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='hover:bg-blue-250 bg-indigo-200 p-1 hover:text-white rounded-full cursor-pointer h-6 w-6'
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
          <div className='text-center'>
            <h3 className='text-blue-250 text-base'>Chef</h3>
            <h3 className='text-red-250 font-bold text-lg'>
              Hannah Herrera-Bagatsing
            </h3>
          </div>
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
