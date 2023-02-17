// import React, { useState } from 'react';

import { useEffect, useState } from 'react';
import { getFileParams, s3 } from '../../aws/file';
import SideBar from '../../components/common/SideBar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  toggleProd,
  toggleCategory,
  toggleUpload,
  toggleEditProd,
  toggleConfirmDelete,
} from '../../redux/popUpSlice';
import AddCategory from './popups/AddCategory';
import AddProduct from './popups/AddProd';
import UploadMenu from './popups/UploadMenu';
import { iCategory, iProduct } from '../../../constant/interface';
// import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import {
  getDataFromDynamo,
  useDynamoCategories,
  useDynamoData,
} from '../../hooks/useDynamoDBData';
import EditProduct from './popups/EditProd';
import ConfirmPage from '../../components/common/Confirm';
import ModalBox from '../../components/common/ModalBox';

//TODO layout for product list with delete and edit button
//TODO create button for
// TODO add aws chaching for images
// TODO add useref for chaching and usememo
// !! get sidebar open status to make the row wider

const Products = () => {
  const categoriesList = useDynamoCategories(
    import.meta.env.VITE_AWS_CATEGORY_TABLE
  );

  const editProdIsOpen = useAppSelector(
    (state) => state.toggling.editProdIsOpen
  );
  const modalIsOpen = useAppSelector((state) => state.toggling.modalIsOpen);
  const prodIsOpen = useAppSelector((state) => state.toggling.prodIsOpen);
  const categIsOpen = useAppSelector((state) => state.toggling.categoryIsOpen);
  const uploadIsOpen = useAppSelector((state) => state.toggling.uploadIsOpen);
  const confirmIsOpen = useAppSelector((state) => state.toggling.confirmIsOpen);
  const [currentData, setCurrentData] = useState({});
  const [rerender, setRerender] = useState(false);
  const [dataList, setDataList] = useState<any>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const new_data = await getDataFromDynamo(
        import.meta.env.VITE_AWS_MENU_TABLE
      );

      if (new_data) {
        setDataList(new_data);
        setRerender(false);
      }
    };

    fetchData();
  }, [rerender]);

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: iProduct
  ) => {
    setCurrentData(item);
    dispatch(toggleConfirmDelete());
  };

  const sortByPrice = () => {
    const res = [...dataList].sort((a: iProduct, b: iProduct) => {
      if (+a.price < +b.price) {
        return -1;
      } else if (+a.price > +b.price) {
        return 1;
      } else {
        return 0;
      }
    });
    setDataList(res);
  };

  const sortByProduct = () => {
    const res = [...dataList].sort((a: iProduct, b: iProduct) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
    setDataList(res);
  };

  const sortByCategory = () => {
    const res = [...dataList].sort((a: iProduct, b: iProduct) => {
      if (a.category_id < b.category_id) {
        return -1;
      } else if (a.category_id > b.category_id) {
        return 1;
      } else {
        return 0;
      }
    });
    setDataList(res);
  };

  const handleEdit = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: iProduct
  ) => {
    // console.log('ite', item);
    setCurrentData(item);
    dispatch(toggleEditProd());
  };

  const reloadMenu = () => {
    setRerender(true);
  };

  return (
    <>
      {modalIsOpen && <ModalBox />}
      {confirmIsOpen && (
        <ConfirmPage currentData={currentData} reloadMenu={reloadMenu} />
      )}
      {uploadIsOpen && <UploadMenu />}
      {categIsOpen && <AddCategory />}
      {prodIsOpen && <AddProduct reloadMenu={reloadMenu} />}
      {editProdIsOpen && currentData && (
        <EditProduct currentData={currentData} reloadMenu={reloadMenu} />
      )}
      <section className='flex overflow-hidden w-full'>
        <SideBar />
        <main className='flex-1 pb-8 max-w-[80%] xl:max-w-[70%] h-screen overflow-auto mx-auto my-0'>
          {/*  */}
          {/* ProductsHeader */}

          <div className='flex items-center justify-between py-5 px-5 mt-5'>
            <div className='flex flex-row justify-end grow'>
              <button className='inline-flex gap-x-2 mr-2 items-center py-2 px-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'>
                <span
                  className='md:text-sm font-semibold tracking-wide xs:text-xs'
                  onClick={() => dispatch(toggleUpload())}
                >
                  Upload PDF
                </span>
              </button>
              <button className='inline-flex gap-x-2 mx-2 items-center py-2 px-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'>
                <span
                  className='md:text-sm font-semibold tracking-wide xs:text-xs'
                  onClick={() => dispatch(toggleCategory())}
                >
                  Category+
                </span>
              </button>
              <button className='inline-flex gap-x-2 ml-2 items-center py-2 px-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'>
                <span
                  className='xs:text-xs md:text-sm font-semibold tracking-wide'
                  onClick={() => dispatch(toggleProd())}
                >
                  New Item
                </span>
              </button>
            </div>
          </div>

          {/*  */}
          {/* table */}
          <table className='w-full border-b border-gray-200 '>
            <thead>
              <tr className='text-sm md:text-lg font-medium text-gray-700 border-b border-gray-200'>
                <td
                  className='pl-5 cursor-pointer hover:bg-blue-550 hover:text-white'
                  onClick={sortByProduct}
                >
                  <div className='flex items-center gap-x-4 text-center'>
                    <span className='xs:mx-auto xs:my-0 md:mx-0'>Product</span>
                  </div>
                </td>
                <td
                  className='py-4 px-2 text-center cursor-pointer hover:bg-blue-550 hover:text-white'
                  onClick={sortByPrice}
                >
                  Pricing
                </td>
                <td
                  className='py-4 px-2 text-center cursor-pointer hover:bg-blue-550 hover:text-white'
                  onClick={sortByCategory}
                >
                  Category
                </td>
                <td className='py-4 px-2 text-center'>Actions</td>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((item: iProduct, index: number) => {
                  try {
                    const imgUrl = s3.getSignedUrl('getObject', {
                      ...getFileParams,
                      Key: 'menu/' + item.img_Url,
                    });

                    const currCategory = categoriesList.data.find(
                      (category: iCategory) => category.id === item.category_id
                    );
                    if (imgUrl && currCategory) {
                      return (
                        <tr
                          className='hover:bg-gray-100 transition-colors group sm:text-sm md:text-lg'
                          key={index}
                        >
                          <td className='flex gap-x-4 items-center py-4 md:pl-5 xs:flex-col md:flex-row xs:pl-2'>
                            <img
                              src={imgUrl}
                              alt=''
                              className='w-40 aspect-[3/2] rounded-lg object-cover object-top border border-gray-200'
                            />

                            <div>
                              <div className='font-medium text-gray-700 xs:text-xs sm:text-sm text-center md:text-lg xs:mt-3 md:mt-0'>
                                {item.name}
                              </div>
                            </div>
                          </td>
                          <td className='font-medium text-center'>
                            ₱{item.price}
                          </td>
                          <td className='font-medium text-center'>
                            {/* {item.category_id.substring(0, 5)} */}
                            {currCategory.name}
                          </td>
                          <td>
                            <div className='text-center '>
                              <button
                                className='p-2 hover:rounded-md hover:bg-indigo-800 bg-indigo-600 text-white rounded-lg px-4'
                                onClick={(e) => handleEdit(e, item)}
                              >
                                Edit
                              </button>

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
                    }
                  } catch (error) {
                    return null;
                  }
                })}
            </tbody>
          </table>

          {/*  */}
          {/* pagination */}

          {/* <div className='flex gap-x-2 justify-center pt-8'>
            <button className='flex justify-center items-center w-8 h-8'>
              <GoChevronLeft className='w-6 h-6 to-gray-800 stroke-current hover:text-indigo-600' />
            </button>
            <button className='flex items-center justify-center w-8 h-8 font-medium rounded-full'>
              {/* Map here the number of pages */}
          {/* <span>1</span> */}
          {/* </button> */}
          {/* <button className='flex justify-center items-center w-8 h-8'> */}
          {/* <GoChevronRight className='w-6 h-6 to-gray-800 stroke-current hover:text-indigo-600' /> */}
          {/* </button> */}
          {/* </div> */}
        </main>
      </section>
    </>
  );
};

export default Products;
