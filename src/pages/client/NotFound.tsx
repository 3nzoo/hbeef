import { useEffect, useState } from 'react';
import { useClientAppSelector } from '../../redux/hooks';
import { GiCook } from 'react-icons/gi';

const PageNotFound = () => {
  const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);
  const [defaultNum, setDefaultNum] = useState('');
  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  return !navIsOpen ? (
    <div className='h-auto flex w-auto mb-0 mt-5 flex-wrap content-center flex-col'>
      <section
        className={
          `flex justify-center mb-10 xs:mt-40 bg-white bg-opacity-50 mx-3 rounded-2xl max-w-[720px] backdrop-blur-sm transition-opacity duration-500 ${
            initiate && ' opacity-100 '
          }` + `${!initiate && ' opacity-0'}`
        }
      >
        <div
          className={
            `flex flex-wrap border-blue-250 border-8 xs:p-4 rounded-2xl justify-center w-auto ` +
            ` w-full transition-transform duration-500 ${
              initiate && ' translate-y-0 '
            }` +
            `${!initiate && ' -translate-y-10'}`
          }
        >
          <h1 className='text-red-250 xs:text-2xl sm:text-3xl md:text-4xl xs:mb-2 xs:mt-2 lg:mt-8'>
            • Page Not Found •
          </h1>
          <div className='flex flex-col grow h-auto w-full justify-center items-center xs:my-2 sm:my-5 xs:text-sm md:text-lg '>
            <div className='w-auto text-center '>
              <h1 className='xs:text-red-250 md:text-red-400  xs:text-3xl  md:text-4xl xs:relative md:absolute md:top-[38%] md:left-[44%]'>
                404
              </h1>
              <GiCook className='xs:h-44 xs:w-44 md:h-72 md:w-72 stroke-blue-900 stroke-2 text-blue-250' />
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : (
    <></>
  );
};

export default PageNotFound;
