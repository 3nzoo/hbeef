import { useLocation } from 'react-router-dom';
import fb from '../../assets/facebook-app-icon.svg';
import ig from '../../assets/ig-instagram-icon.svg';
export const Footer = () => {
  const location = useLocation();

  const handleClick = () => {
    window.open(
      'https://www.facebook.com/hannahbsbeef',
      '_blank',
      'noreferrer'
    );
  };

  return (
    <div className='footer flex items-center justify-center left-0 right-0 bottom-2 fixed md:flex md:items-center md:justify-center overflow-hidden text-xs pt-20 -z-10'>
      © 2022 hcuisine.store by{' '}
      <button onClick={handleClick}>
        <span className='text-indigo-500 pl-1 cursor-pointer hover:text-blue-250'>
          Hannah B's Beef
        </span>
      </button>
      {location.pathname.toLowerCase() === '/menu' ? (
        <></>
      ) : (
        <div className='absolute right-8 z-10 top-0 xs:hidden md:block flex flex-row max-w-[120px] text-center text-red-600 text-2xl flex-wrap'>
          Follow Us!
          <button
            className='mr-3 mt-1 cursor-pointer z-40'
            onClick={() => {
              window.open(
                'https://www.facebook.com/hcuisine',
                '_blank',
                'noreferrer'
              );
            }}
          >
            <img width={'40px'} src={fb} />
          </button>
          <button
            className='cursor-pointer z-40'
            onClick={() => {
              window.open(
                'https://www.instagram.com/hcuisine/',
                '_blank',
                'noreferrer'
              );
            }}
          >
            <img width={'40px'} src={ig} />
          </button>
        </div>
      )}
    </div>
  );
};
