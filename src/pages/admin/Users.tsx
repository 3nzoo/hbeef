import React, { useEffect, useState } from 'react';

import ConfirmDelete from '../../components/common/ModalConfirm';
import SideBar from '../../components/common/SideBar';
import { getDataFromDynamo } from '../../hooks/useDynamoDBData';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleAddUser, toggleConfirmDelete } from '../../redux/popUpSlice';
import AddUser from './popups/AddUser';

const Users = () => {
  const [dataList, setDataList] = useState<any>([]);
  const confirmIsOpen = useAppSelector((state) => state.toggling.confirmIsOpen);
  const dispatch = useAppDispatch();
  const [currentData, setCurrentData] = useState({});
  const userIsOpen = useAppSelector((state) => state.toggling.userIsOpen);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const new_data = await getDataFromDynamo(
        import.meta.env.VITE_AWS_USER_TABLE
      );

      if (new_data) {
        setDataList(new_data);
        setRerender(false);
      }
    };

    fetchData();
  }, [rerender]);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, item: any) => {
    setCurrentData(item);
    dispatch(toggleConfirmDelete());
  };

  const sortByName = () => {
    const res = [...dataList].sort((a: any, b: any) => {
      if (a.username < b.username) {
        return -1;
      } else if (a.username > b.username) {
        return 1;
      } else {
        return 0;
      }
    });
    setDataList(res);
  };

  const sortByRole = () => {
    const res = [...dataList].sort((a: any, b: any) => {
      if (a.role > b.role) {
        return -1;
      } else if (a.role < b.role) {
        return 1;
      } else {
        return 0;
      }
    });
    setDataList(res);
  };

  const reloadMenu = async () => {
    setRerender(true);
  };

  return (
    <>
      {confirmIsOpen && (
        <ConfirmDelete currentData={currentData} reloadMenu={reloadMenu} />
      )}
      {userIsOpen && <AddUser reloadMenu={reloadMenu} />}

      <section className='flex overflow-hidden w-full'>
        <SideBar />

        <main className='flex-1 pb-8 xs:max-w-[80%] md:max-w-[50%] h-screen overflow-auto mx-auto my-0 z-20 '>
          {/*  */}
          {/* ProductsHeader */}

          <div className='flex items-center justify-between py-3 px-5 mt-3'>
            <div className='flex flex-row justify-end grow '>
              <button
                className='inline-flex gap-x-2 ml-2 items-center py-2 px-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'
                onClick={() => dispatch(toggleAddUser())}
              >
                <span className='xs:text-xs md:text-sm font-semibold tracking-wide'>
                  Add New User
                </span>
              </button>
            </div>
          </div>

          {/*  */}
          {/* table */}
          <label className='block bg-blue-550 rounded-lg text-gray-200 my-3 py-2 text-center ,xs:text-base md:text-xl font-bold  '>
            Users List
          </label>
          <table className='w-full border-b border-gray-200 text-sm'>
            <thead>
              <tr className='text-sm md:text-lg font-medium text-gray-700 border-b border-gray-200 '>
                <td
                  className='pl-5 cursor-pointer hover:bg-blue-550 hover:text-white'
                  onClick={sortByName}
                >
                  <div className='flex items-center gap-x-4 text-center  '>
                    <span className='xs:mx-auto xs:my-0 md:mx-0'>Username</span>
                  </div>
                </td>
                <td
                  className='py-4 px-2 text-center cursor-pointer hover:bg-blue-550 hover:text-white'
                  onClick={sortByRole}
                >
                  Role
                </td>

                <td className='py-4 px-2 text-center'>Actions</td>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((item: any, index: number) => {
                  if (item.role !== 'first_admin')
                    return (
                      <tr
                        className='hover:bg-gray-100 transition-colors group sm:text-sm md:text-lg'
                        key={index}
                      >
                        <td className='flex gap-x-4 items-center py-4 md:pl-5 xs:flex-col md:flex-row xs:pl-2'>
                          <div>
                            <div className='font-medium text-gray-700 xs:text-xs sm:text-sm text-center md:text-lg xs:mt-3 md:mt-0'>
                              {item.username}
                            </div>
                          </div>
                        </td>
                        <td className='font-medium text-center'>{item.role}</td>

                        <td>
                          <div className='text-center '>
                            <button
                              className='p-2 m-3 hover:rounded-md hover:bg-red-800 bg-red-600 text-white rounded-lg'
                              onClick={(e) => handleDelete(e, item)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                })}
            </tbody>
          </table>
        </main>
      </section>
    </>
  );
};

export default Users;
