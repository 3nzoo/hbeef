import { useEffect, useRef, useState } from 'react';
import {
  useClientAppDispatch,
  useClientAppSelector,
} from '../../../redux/hooks';
import { MdOutlineAddCircle } from 'react-icons/md';
import { AiFillMinusCircle } from 'react-icons/ai';
import { addToCart, removeOneFromCart } from '../../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

interface Food {
  data: any;
  onClick: (e: React.MouseEvent<HTMLOrSVGElement>) => void;
}

const Food = (props: Food) => {
  const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);
  const [initiate, setInitiate] = useState(false);
  const dispatch = useClientAppDispatch();
  const cart = useClientAppSelector((state) => state.cart);
  const effectRan = useRef(false);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const handleRemoveOneFromCart = (productId: string) => {
    dispatch(removeOneFromCart({ productId }));
  };

  const handleAddToCart = () => {
    const name: string = props.data.name;
    const productId: string = props.data.id;
    const price: number = Number(props.data.price);
    const img_Url: string = props.data.img_Url;
    const quantity = 1;
    if (productId)
      dispatch(addToCart({ name, productId, quantity, price, img_Url }));
  };

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  useEffect(() => {
    if (effectRan.current === true) {
      const existingItem = cart.find(
        (item) => item.productId === props.data.id
      );
      if (existingItem) {
        setCount(existingItem.quantity);
      } else {
        setCount(0);
      }
    }

    return () => {
      effectRan.current = true;
    };
  }, [handleAddToCart, handleRemoveOneFromCart]);

  return !navIsOpen ? (
    <div className='h-screen z-50 fixed w-screen flex left-0 top-0 bg-gray-800 bg-opacity-80 mb-0 flex-wrap content-center flex-col'>
      <section
        className={
          `flex justify-center mb-10 xs:mt-12 bg-white bg-opacity-80  mx-3  xs:max-h-[80%] md:max-h-[60%] max-w-[720px] rounded-2xl backdrop-blur-sm transition-opacity duration-500 ${
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
          <div className='w-full p-2 flex justify-end absolute -right-5 -top-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='  p-1 rounded-full cursor-pointer h-7 w-7 bg-blue-250 hover:bg-red-700 text-white '
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

          <div className='w-full text-center'>
            <h1 className='text-red-250 xs:text-3xl md:text-4xl xs:mb-2 md:mb-2 xs:mt-3 md:mt-5'>
              • {props.data.name} •
            </h1>
          </div>
          <div className='h-screen flex flex-col w-auto xs:max-h-[70%] md:max-h-[100%]  border-green-600 '>
            <div className='flex-1 overflow-y-scroll'>
              <div className='grid xs:grid-cols-1 md:grid-cols-2 gap-2 xs:p-1 md:p-2'>
                <div className='flex justify-center flex-wrap'>
                  <img
                    className='w-auto h-auto object-cover rounded-t-lg rounded-lg shadow-lg text-center border-4 border-white xs:w-[70%] sm:min-w-[80%]
                    sm:w-auto md:w-[100%] sm:max-w-[60%]'
                    src={props.data.img_Url}
                    loading='lazy'
                    alt={props.data.name}
                  />
                </div>
                <div className='w-full text-center h-full m-auto max-w-[70%] '>
                  <div className='flex flex-col justify-center gap-2 my-3'>
                    <label className='text-blue-250'>Description: </label>
                    <h1>{props.data.description}</h1>
                  </div>
                  <div className='flex flex-row mt-5 justify-center gap-2'>
                    <label className='text-blue-250'>Price: </label>
                    <h1>₱{props.data.price}.00</h1>
                  </div>
                  <div className='flex flex-row mt-5 justify-center items-center gap-2'>
                    <button
                      className=' text-blue-250 text-lg disabled:text-gray-600'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOneFromCart(props.data.id);
                      }}
                      disabled={count < 1}
                    >
                      <AiFillMinusCircle className='h-8 w-8' />
                    </button>
                    ({count})
                    <button
                      className='text-blue-250 text-lg'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                    >
                      <MdOutlineAddCircle className='h-8 w-8' />
                    </button>
                  </div>
                  <div className='flex flex-row mt-5 justify-center items-center gap-2'>
                    <button
                      className='xs:px-3 xs:py-2 xs:m-0 md:px-4 md:py-2 bg-red-250 hover:bg-red-600 text-white font-medium rounded-lg xs:text-base md:text-lg xs:my-1'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                        navigate('/cart');
                      }}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : (
    <></>
  );
};

export default Food;
