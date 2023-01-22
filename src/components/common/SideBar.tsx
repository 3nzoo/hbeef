import React, { useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { RiSettings4Line } from 'react-icons/ri';
import { ImUsers } from 'react-icons/im';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { SiHappycow } from 'react-icons/si';
import { IconType } from 'react-icons';
import { AiFillCalendar } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggle } from '../../redux/sidebarSlice';

interface iMenu {
  name: string;
  link: string;
  icon: IconType;
  margin?: string;
}

function SideBar() {
  const menus: iMenu[] = [
    { name: 'Products', link: '/admin', icon: SiHappycow },
    { name: 'Users', link: '/admin/users', icon: ImUsers },
    { name: 'Reservation', link: '/admin/reservation', icon: AiFillCalendar },
    { name: 'Settings', link: '/admin/settings', icon: RiSettings4Line },
  ];
  const open = useAppSelector((state) => state.sidebar.isOpen);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // const [open, setOpen] = useState(true && window.innerWidth > 640);

  const handleToggle = () => {
    dispatch(toggle());
  };

  const handleLogout: React.MouseEventHandler<HTMLDivElement> = () => {
    console.log('Logout now!');
    navigate('/login');
  };

  return (
    <>
      <div
        className={`bg-blue-550 min-h-screen ${
          open ? 'w-44' : 'w-20'
        } duration-500 text-gray-100 px-4`}
      >
        <div className='py-3 flex justify-end'>
          <HiMenuAlt3
            size={26}
            className='cursor-pointer'
            onClick={handleToggle}
          />
        </div>
        <div className='mt-4 flex flex-col gap-4 relative '>
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={` ${
                menu?.margin && 'mt-5' && window.innerWidth > 640
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
            >
              <div
                className={
                  'ml-1 ' +
                  `${
                    menu?.link === location.pathname
                      ? ' text-yellow-400'
                      : 'text-gray-100'
                  }`
                }
              >
                {React.createElement(menu?.icon, { size: '20' })}
              </div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={
                  `whitespace-pre duration-500 ${
                    !open && 'opacity-0 translate-x-28 overflow-hidden'
                  }` +
                  `${
                    menu?.link === location.pathname
                      ? ' text-yellow-400'
                      : 'text-gray-100'
                  }`
                }
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && 'hidden'
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-16 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
          <div
            className='flex text-sm cursor-pointer gap-3.5 font-medium p-2 hover:bg-gray-800 group rounded-md'
            onClick={handleLogout}
          >
            <div className='ml-1'>
              {React.createElement(RiLogoutBoxRLine, { size: '20' })}
            </div>

            <h2
              style={{
                transitionDelay: `${5 + 3}00ms`,
              }}
              className={`whitespace-pre duration-500 ${
                !open && 'opacity-0 translate-x-28 overflow-hidden'
              }`}
            >
              Logout
            </h2>
            <h2
              className={`${
                open && 'hidden'
              } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-16 group-hover:duration-300 group-hover:w-fit  `}
            >
              Logout
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
