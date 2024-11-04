// TODO confirm order that will go to ordercomplete or popup fail
// TODO add a send loading component
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import OrdersComplete from './OrdersComplete';
import { useClientAppDispatch, useClientAppSelector } from '../../redux/hooks';
import LoadingPage from '../../components/common/Loading';
import { addToCart, clearCart, removeOneFromCart } from '../../redux/cartSlice';
import { MdOutlineAddCircle } from 'react-icons/md';
import { AiFillMinusCircle } from 'react-icons/ai';
import AWS from 'aws-sdk';
import InputContacts from './InputContacts';
import { config } from '../../config';

const sns = new AWS.SNS({
  region: config.aws_region,
  apiVersion: '2010-03-31',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const Cart = () => {
  const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);
  const [success, setSuccess] = useState(false);
  const [initiate, setInitiate] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useClientAppDispatch();
  const cart = useClientAppSelector((state) => state.cart);
  const [addContact, setAddContact] = useState(false);
  const [orderDetails, setOrderDetails] = useState('');
  const handleRemoveOneFromCart = (productId: string) => {
    dispatch(removeOneFromCart({ productId }));
  };

  const handleConfirm = async () => {
    const res = cart.map((item) => {
      return { it: item.name.slice(0, 10), qty: item.quantity };
    });
    if (cart.length < 1) {
      return toast.error(
        'Empty Cart!! Please go to our Menu page to add Items',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Flip,
        }
      );
    }

    const total = cart
      .reduce((total, item) => total + item.quantity * item.price, 0)
      .toFixed(2);

    const completeOrder = `\n${JSON.stringify(res)
      .replace(/},/g, '\n')
      .replace(/[[{"]/g, '')
      .replace(/}]/g, '')
      .replace(/,/g, '-')}\nTotalAmt:+${total}`;

    setOrderDetails(completeOrder);

    setAddContact(true);
  };

  const handleAddToCart = (
    name: string,
    productId: string,
    price: number,
    img_Url: string
  ) => {
    const quantity = 1;
    dispatch(addToCart({ name, productId, quantity, price, img_Url }));
  };

  const handleClose = () => {
    setSuccess(!success);
  };

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  if (success) {
    return <OrdersComplete onClick={handleClose} />;
  }

  if (addContact) {
    return addContact && <InputContacts message={orderDetails} />;
  }

  return !navIsOpen ? (
    <div className='h-auto flex w-auto mb-0 mt-5 flex-wrap content-center flex-col'>
      {loading && <LoadingPage />}

      <ToastContainer />
      <section
        className={
          `flex justify-center mb-10 xs:mt-40 bg-white bg-opacity-70 mx-3 rounded-2xl max-w-[900px] backdrop-blur-lg transition-opacity duration-500 ${
            initiate && ' opacity-100 '
          }` + `${!initiate && ' opacity-0'}`
        }
      >
        <div
          className={
            `flex flex-wrap border-blue-250 border-8 xs:p-4 rounded-2xl justify-center ` +
            ` w-full transition-transform duration-500 ${
              initiate && ' translate-y-0 '
            }` +
            `${!initiate && ' -translate-y-10'}`
          }
        >
          <h1 className='text-red-250 xs:text-2xl md:text-4xl xs:mb-2 md:mb-2'>
            • Cart •
          </h1>
          <div className='w-full h-auto max-h-96 min-h-48 overflow-auto'>
            <table className='w-full '>
              <thead className='sticky top-0 bg-yellow-350 h-12 backdrop-blur-lg bg-opacity-25'>
                <tr className='xs:text-sm md:text-base'>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 &&
                  cart.map((item, index) => (
                    <tr className='text-center' key={index}>
                      <td className='w-auto max-w-[100px]'>
                        <div className='flex flex-col justify-center items-center my-3 text-blue-250'>
                          <img
                            className='w-32 h-auto object-cover rounded-t-lg rounded-lg shadow-lg text-center border-4 border-white mb-5'
                            src={item.img_Url}
                            loading='lazy'
                            alt={item.name}
                          />
                          {item.name}
                        </div>
                      </td>
                      <td className='text-center  xs:text-sm md:text-base'>
                        <div className='flex items-center justify-center'>
                          <button
                            className=' hover:text-blue-250 text-gray-500 xs:text-xs md:text-base disabled:text-gray-600'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveOneFromCart(item.productId);
                            }}
                            disabled={item.quantity < 1}
                          >
                            <AiFillMinusCircle className='xs:h-6 xs:w-6 md:h-8 md:w-8' />
                          </button>

                          <span className='xs:px-1 md:px-2'>
                            {item.quantity}
                          </span>
                          <button
                            className='hover:text-blue-250 text-gray-500 text-base'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(
                                item.name,
                                item.productId,
                                item.price,
                                item.img_Url
                              );
                            }}
                          >
                            <MdOutlineAddCircle className='xs:h-6 xs:w-6 md:h-8 md:w-8' />
                          </button>
                        </div>
                      </td>

                      <td>{item.price}</td>
                      <td>{Number(item.quantity) * Number(item.price)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className='float-right mt-0 xs:mr-2 md:mr-5 sticky bottom-0 bg-yellow-350 backdrop-blur-lg bg-opacity-60'>
              <p className='text-gray-600'>
                Total Bill:
                <span className='ml-3 text-xl text-red-250'>
                  ₱
                  {cart
                    .reduce(
                      (total, item) => total + item.quantity * item.price,
                      0
                    )
                    .toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          <div className='flex w-full justify-end xs:flex-wrap sm:flex-nowrap mt-3 xs:mr-0 md:mr-3'>
            {/* <button
              className='bg-red-250 text-white font-semibold hover:bg-blue-700 py-1 px-4 border-2 border-red-250 hover:border-transparent rounded-full text-sm cursor-pointer disabled:bg-gray-700'
              onClick={handleClearCart}
            >
              Clear Cart
            </button> */}
            <button
              className='bg-blue-250 text-white font-semibold hover:bg-red-700 py-1 px-4 border-2 border-blue-250 hover:border-transparent rounded-full text-sm cursor-pointer disabled:bg-gray-700 mt-1'
              disabled={loading}
              onClick={handleConfirm}
            >
              Order Now!
            </button>
          </div>
        </div>
      </section>
    </div>
  ) : (
    <></>
  );
};

export default Cart;
