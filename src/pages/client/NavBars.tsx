import { AnimateSharedLayout, motion } from 'framer-motion';
import React from 'react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logosmall.png';
import { Transition } from '@headlessui/react';

const NavBars: React.FC = () => {
  const location = useLocation();
  const [selected, setSelected] = useState<string>(
    location.pathname === '/' ? 'Home' : location.pathname.replace('/', '')
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className='bg-blue-250 top-14 left-0 flex justify-between items-center h-16 fixed w-screen'>
      <a href='/' className='topLogo'>
        <img
          src={logo}
          width='280px'
          alt='Logo'
          className='hlogo right-0 left-0 mx-auto fixed top-0 md:flex lg:items-center lg:justify-center lg:ml-5 xl:ml-20'
        />{' '}
      </a>
      <AnimateSharedLayout>
        <div className='hidden lg:block'>
          <div className='ml-4 flex items-baseline space-x-4'>
            <ul className='navList xl:mr-10 lg:mr-5 flex flex-row p-0 list-none flex-wrap'>
              {links.map((link) => (
                <Item
                  key={link}
                  value={link}
                  isSelected={selected === link}
                  onClick={() => {
                    setSelected(link);
                  }}
                />
              ))}
            </ul>
          </div>
        </div>
      </AnimateSharedLayout>
      <div className='mr-2 flex lg:hidden'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type='button'
          className={
            ` inline-flex items-center justify-center p-2 rounded-md hover:text-white  ` +
            `${
              isOpen
                ? 'fixed text-white bg-indigo-600   right-2 top-2 z-20 hover:bg-blue-250'
                : 'bg-white bg-opacity-20 text-white hover:bg-blue-800'
            }`
          }
          aria-controls='mobile-menu'
          aria-expanded='false'
        >
          <span className='sr-only bg-green'>Open main menu</span>
          {!isOpen ? (
            <svg
              className='block h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          ) : (
            <svg
              className='block h-6 w-6 text-black hover:text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          )}
        </button>
      </div>
      <Transition
        className='w-full h-screen fixed top-0 left-0 bg-yellow-250 z-10 text-black'
        show={isOpen}
        enter='transition ease-out duration-100 transform'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='transition ease-in duration-75 transform'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
      >
        {
          <div
            className='lg:hidden z-10 mt-0 flex justify-center'
            id='mobile-menu'
          >
            <div className='mb-wrapper w-6/12 pt-2 pb-3 space-y-1 flex flex-wrap h-screen content-center justify-center'>
              <ul className='navList h-2/4 mt-10'>
                {links.map((link) => (
                  <MobileItem
                    key={link}
                    value={link}
                    isNowOpen={isOpen}
                    isSelected={selected === link}
                    onClick={() => {
                      setSelected(link);
                      setIsOpen(!isOpen);
                    }}
                  />
                ))}
              </ul>
            </div>
          </div>
        }
      </Transition>
    </div>
  );
};

interface ItemProps {
  isNowOpen?: boolean;
  value: string;
  isSelected: Boolean;
  onClick: () => void;
}

function Item({ value, isSelected, onClick }: ItemProps) {
  let outl = 60;
  if (value.length > 5) {
    outl = (value.length + 1.2) * 9.2;
  }
  if (value === 'Cart') {
    outl = 38;
  }

  if (value === 'Reservation') {
    outl = 105;
  }
  console.log(location.pathname);
  return (
    <li
      className='item ml-2 flex items-baseline relative min-w-[60px] w-auto cursor-pointer flex-shrink'
      onClick={onClick}
    >
      <NavLink
        className={
          `navbar-link  inline-block px-4 hover:border-b-1 hover:text-white mr-2 ` +
          `${
            value === location.pathname.replace('/', '')
              ? 'text-white'
              : location.pathname === '/' && value === 'Home'
              ? 'text-white'
              : 'text-indigo-200'
          }`
        }
        to={value === 'Home' ? '/' : value}
      >
        {value != 'Cart' ? (
          value
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 hover:text-white'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
            />
          </svg>
        )}
      </NavLink>
      {isSelected && (
        <motion.div
          style={{ width: `${outl}px` }}
          layoutId='outline'
          className='lineout outline-none absolute -bottom-1 left-2 border-white border-b-white border bg-white'
          initial={false}
          animate={{ borderColor: value }}
          transition={spring}
        />
      )}
    </li>
  );
}

function MobileItem({ isNowOpen, value, onClick }: ItemProps) {
  return (
    <li
      className='flex-shrink-0 flex mb-3 lg:py-2 sm:py-2 justify-center'
      onClick={onClick}
    >
      <NavLink
        // activeClassName='mobile-active'
        className={
          `navto text-2xl navbar-link inline-block px-4 text-blue-250 hover:border-b-1 hover:text-red-250  active:text-white leading-[45px] ` +
          `${
            value === location.pathname.replace('/', '')
              ? 'text-red-250'
              : location.pathname === '/' && value === 'Home'
              ? 'text-red-250'
              : 'text-blue-250'
          }`
        }
        to={value === 'Home' ? '/' : value}
      >
        • {value} •
      </NavLink>
    </li>
  );
}

const links = ['Home', 'Menu', 'Reservation', 'Contact', 'Cart'];

const spring = {
  type: 'spring',
  stiffness: 500,
  damping: 20,
};

export default NavBars;
