import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getDataFromDynamo } from '../../hooks/useDynamoDBData';
import { useClientAppDispatch, useClientAppSelector } from '../../redux/hooks';
import AWS from 'aws-sdk';
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuccessPage from './RequestSent';
import LoadingPage from '../../components/common/Loading';
import OrdersComplete from './OrdersComplete';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/cartSlice';
import { config } from '../../config';

const sns = new AWS.SNS({
  region: config.aws_region,
  apiVersion: '2010-03-31',
});

interface InputContactsFormData {
  name: string;
  number: string;
  extraNumber?: string;
  email: string;
  address: string;
}

interface inputProps {
  message: string;
}

const InputContacts = (message: inputProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<InputContactsFormData>({
    name: '',
    number: '',
    extraNumber: '',
    email: '',
    address: '',
  });
  const navigate = useNavigate();
  const dispatch = useClientAppDispatch();

  // const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);
  const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);
  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  const handleClickClose = () => {
    setSuccess(false);
    setLoading(false);
    // navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, extraNumber, address, ...rest } = formData;

    if (Object.values(rest).some((value: any) => value.toString() === '')) {
      return toast.error('Name and Contact number are required.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Flip,
      });
    }

    const messageDetails = {
      Na: formData.name,
      Num: formData.number,
      em: formData.email,
      add: formData.address,
      ext: formData.extraNumber,
    };

    setLoading(true);
    const params: any = {
      Message: `Order Details\n${JSON.stringify(messageDetails)
        .replace(/"/g, '')
        .replace(/,/g, '\n')
        .replace(/{/g, '')
        .replace(/}/g, '')} ${message.message}`,
      TopicArn: config.aws_topicArn,
    };

    await sns.publish(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        setLoading(false);
        return toast.error(
          'We cannot send your Request, Please Try Again Later',
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
      } else {
        setLoading(false);
        dispatch(clearCart());
        setSuccess(!success);
      }
    });
  };

  const handleClose = () => {
    setSuccess(!success);
    navigate('/menu');
  };

  if (success) {
    return <OrdersComplete onClick={handleClose} />;
  }

  return !navIsOpen ? (
    <div className='h-auto flex w-auto mb-0 mt-5 flex-wrap content-center flex-col'>
      {loading && <LoadingPage />}
      <section
        className={
          `flex justify-center mb-10 xs:mt-36 sm:mt-40 bg-white bg-opacity-60 mx-3 rounded-2xl max-w-[760px] backdrop-blur-lg transition-opacity duration-500 ${
            initiate && ' opacity-100 '
          }` + `${!initiate && ' opacity-0'}`
        }
      >
        <div
          className={
            `flex flex-wrap border-blue-250 border-8 xs:p-4 md:p-6 rounded-2xl justify-center w-auto ` +
            ` w-full transition-transform duration-500 ${
              initiate && ' translate-y-0 '
            }` +
            `${!initiate && ' -translate-y-10'}`
          }
        >
          <h1 className='text-red-250 xs:text-xl sm:text-2xl md:text-4xl mb-2'>
            • Contact Information •
          </h1>
          <p>Please fill up this form to complete your order.</p>
          <form
            className='w-auto pt-5 xs:px-4 md:px-6  flex gap-4 justify-center text-lg flex-wrap xs:max-w-[90%] md:max-w-[100%]'
            onSubmit={handleSubmit}
          >
            <div className='flex w-full justify-center xs:flex-wrap sm:flex-nowrap mb-1 gap-4 '>
              <input
                className='appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full md:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white'
                type='text'
                value={formData.name}
                placeholder='Name'
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  });
                }}
              />
              <input
                className='appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full md:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white'
                type='text'
                value={formData.email}
                placeholder='Email'
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  });
                }}
              />
            </div>
            <div className='flex w-full justify-center xs:flex-wrap sm:flex-nowrap mb-1 gap-4 '>
              <input
                className='appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full md:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white'
                type='text'
                value={formData.number}
                maxLength={12}
                minLength={8}
                placeholder='Contact Number'
                onChange={(e) => {
                  if (
                    !isNaN(Number(e.target.value)) &&
                    e.target.value.length < 13
                  )
                    setFormData({
                      ...formData,
                      number: e.target.value,
                    });
                }}
              />
              <input
                className='appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full md:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white'
                type='text'
                value={formData.extraNumber}
                maxLength={12}
                minLength={8}
                placeholder='Other number (optional)'
                onChange={(e) => {
                  if (
                    !isNaN(Number(e.target.value)) &&
                    e.target.value.length < 13
                  )
                    setFormData({
                      ...formData,
                      extraNumber: e.target.value,
                    });
                }}
              />
            </div>
            <div className='flex w-full justify-center xs:flex-wrap sm:flex-nowrap mb-1 gap-4 '>
              <input
                className='appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full md:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white'
                type='text'
                value={formData.address}
                placeholder='Address'
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  });
                }}
              />
            </div>
            <div className='flex w-full justify-end xs:flex-wrap sm:flex-nowrap mb-3 gap-4 '>
              <button
                className='bg-blue-250 text-white font-semibold hover:bg-red-700 py-1 px-6 border-2 border-blue-250 hover:border-transparent rounded-full text-sm cursor-pointer disabled:bg-gray-700'
                disabled={loading}
              >
                Confirm Order
              </button>
            </div>
          </form>
        </div>
      </section>
      <ToastContainer />
    </div>
  ) : (
    <></>
  );
};

export default InputContacts;
