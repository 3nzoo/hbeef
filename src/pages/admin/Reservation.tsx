import React, { useEffect, useState } from 'react';

import ConfirmDelete from '../../components/common/ModalConfirm';
import SideBar from '../../components/common/SideBar';
import { getDataFromDynamo } from '../../hooks/useDynamoDBData';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleConfirmDelete, toggleReserve } from '../../redux/popUpSlice';
import AddReserve from './popups/AddReserve';
import { config } from '../../config';

const Reservation = () => {
  const [dataList, setDataList] = useState<any>([]);
  const confirmIsOpen = useAppSelector((state) => state.toggling.confirmIsOpen);
  const dispatch = useAppDispatch();
  const [currentData, setCurrentData] = useState({});
  const reserveIsOpen = useAppSelector((state) => state.toggling.reserveIsOpen);
  const [rerender, setRerender] = useState(false);
  const [excludeDates, setExcludeDates] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const new_data = await getDataFromDynamo(config.aws_dateTable);

      if (new_data) {
        // setExcludeDates({ ...excludeDates, new_data });
        const result = new_data.map((item) => new Date(item.date));

        if (result) setExcludeDates(result);

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
    const res = [...dataList].sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setDataList(res);
  };

  const sortByRole = () => {
    const res = [...dataList].sort((a: any, b: any) => {
      if (a.description > b.description) {
        return -1;
      } else if (a.description < b.description) {
        return 1;
      } else {
        return 0;
      }
    });
    setDataList(res);
  };

  const reloadMenu = () => {
    setRerender(true);
  };

  return (
    <>
      {confirmIsOpen && (
        <ConfirmDelete currentData={currentData} reloadMenu={reloadMenu} />
      )}
      {reserveIsOpen && (
        <AddReserve excludeDates={excludeDates} reloadMenu={reloadMenu} />
      )}

      <section className='flex overflow-hidden w-full'>
        <SideBar />

        <main className='flex-1 pb-8 xs:max-w-[80%] md:max-w-[50%] h-screen overflow-auto mx-auto my-0 z-20'>
          {/*  */}
          {/* ProductsHeader */}

          <div className='flex items-center justify-between py-3 px-5 mt-3 '>
            <div className='flex flex-row justify-end grow'>
              <button
                className='inline-flex gap-x-2 ml-2 items-center py-2 px-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'
                onClick={() => dispatch(toggleReserve())}
              >
                <span className='xs:text-xs md:text-sm font-semibold tracking-wide'>
                  Add Restricted date
                </span>
              </button>
            </div>
          </div>

          {/*  */}
          {/* table */}
          <label className='block bg-blue-550 rounded-lg text-gray-200 my-3 py-2 text-center xs:text-base md:text-xl font-bold'>
            Restricted Date List
          </label>
          <table className='w-full border-b border-gray-200'>
            <thead>
              <tr className='text-sm md:text-lg font-medium text-gray-700 border-b border-gray-200 '>
                <td
                  className='pl-5 cursor-pointer hover:bg-blue-550 hover:text-white group'
                  onClick={sortByName}
                >
                  <div className='flex items-center gap-x-4 text-center relative '>
                    <span className='xs:mx-auto xs:my-0 md:mx-0'>Date</span>
                    <div className='absolute left-1/4 -translate-x-1/2 bottom-full mb-2 hidden w-max bg-gray-800 text-white text-xs rounded px-2 py-2 group-hover:block'>
                      Sort by Date
                    </div>
                  </div>
                </td>
                <td
                  className='py-4 px-2 text-center cursor-pointer hover:bg-blue-550 hover:text-white'
                  onClick={sortByRole}
                >
                  Description
                </td>

                <td className='py-4 px-2 text-center'>Actions</td>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((item: any, index: number) => {
                  const converted = new Date(item.date);
                  return (
                    <tr
                      className={`${
                        index % 2 === 0 ? 'bg-yellow-450' : 'bg-yellow-350'
                      } hover:bg-yellow-250 transition-colors group sm:text-sm md:text-lg`}
                      key={index}
                    >
                      <td className='flex gap-x-4 items-center py-4 md:pl-5 xs:flex-col md:flex-row xs:pl-2'>
                        <div>
                          <div className='font-medium text-gray-700 xs:text-xs sm:text-sm text-center md:text-lg xs:mt-3 md:mt-0'>
                            {converted
                              .toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                              .toString()}
                          </div>
                        </div>
                      </td>
                      <td className='font-medium text-center'>
                        {item.description}
                      </td>
                      <td>
                        <div className='text-center '>
                          <button
                            className='p-2 text-sm m-3 hover:rounded-md hover:bg-red-800 bg-red-600 text-white rounded-lg'
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

export default Reservation;
