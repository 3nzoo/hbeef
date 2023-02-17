import { useEffect, useState } from 'react';
import { GiCampCookingPot } from 'react-icons/gi';

const LoadingPage = () => {
  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, []);

  return (
    <div
      className={
        `bg-gray-900 bg-opacity-80 top-0 left-0 flex content-center items-center justify-center fixed w-full h-full backdrop-blur-sm z-40 transition-opacity duration-500 ${
          initiate && ' opacity-100 -mt-10'
        }` + `${!initiate && ' opacity-0'}`
      }
    >
      <div
        className={`bg-white p-4 rounded-lg shadow-md  flex gap-2 w-auto bg-opacity-80 `}
      >
        <div className='animate-pulse flex space-x-2 items-center text-center px-2 text-xl'>
          <GiCampCookingPot className='h-7 w-7 text-red-250 ' />
          <h1 className='text-red-250'>Cooking...</h1>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
