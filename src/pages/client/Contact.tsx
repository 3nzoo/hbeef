import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import hmap from '../../assets/map.png';
import { useClientAppSelector } from '../../redux/hooks';
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AWS from 'aws-sdk';
import SuccessPage from './RequestSent';
import LoadingPage from '../../components/common/Loading';
import { config } from '../../config';

import validator from 'validator';
const sns = new AWS.SNS({
  region: config.aws_region,
  apiVersion: '2010-03-31',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// TODO implement open street map

interface ContactFormData {
  name: string;
  email: string;
  number: string;
  subject: string;
  request: string;
}

const Contact = () => {
  const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);
  const [defaultNum, setDefaultNum] = useState('');
  const [initiate, setInitiate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    number: '',
    subject: '',
    request: '',
  });

  useEffect(() => {
    const params = {
      TableName: config.aws_contactTable,
      FilterExpression: 'isDefault = :val',
      ExpressionAttributeValues: {
        ':val': true,
      },
    };
    dynamoDB.scan(params, (err: any, data: any) => {
      if (err) {
        console.error('Error:', err);
      } else {
        setDefaultNum(data.Items[0].contactnum);
      }
    });

    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, request, ...rest } = formData;

    if (!validator.isEmail(email) && email !== '') {
      return toast.error('Email is invalid. Please try again', {
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

    if (Object.values(rest).some((value: any) => value.toString() === '')) {
      return toast.error(
        'All fields are required except the Request and Email fields.',
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

    setLoading(true);
    const params: any = {
      Message: `\nS: ${formData.subject},\nN: ${formData.name},\nC: ${formData.number},\nE: ${formData.email},\nR: ${formData.request}`,
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
        setSuccess(!success);
      }
    });
  };

  const handleClickClose = () => {
    setSuccess(false);
    setLoading(false);
  };

  if (success) {
    return <SuccessPage isTypeof='contact' onClick={handleClickClose} />;
  }

  return !navIsOpen ? (
    <div className='h-auto flex w-auto mb-0 mt-5 flex-wrap content-center flex-col'>
      {loading && <LoadingPage />}
      <ToastContainer />
      <section
        className={
          `flex justify-center mb-10 xs:mt-40 bg-white bg-opacity-50 mx-3 rounded-2xl max-w-[900px] backdrop-blur-sm transition-opacity duration-500 ${
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
          <h1 className='text-red-250 xs:text-2xl md:text-4xl xs:mb-2 md:mb-2'>
            • Message Us •
          </h1>
          <div className='flex md:flex-row xs:flex-col w-full'>
            <div className='w-full '>
              <form
                className='w-auto py-5 xs:px-4 flex gap-4 justify-center text-base flex-wrap'
                onSubmit={handleSubmit}
              >
                <div className='flex w-full justify-center xs:flex-wrap sm:flex-nowrap gap-2 '>
                  <input
                    className='appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full lg:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white'
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
                    className='xs:mt-2 sm:mt-0 appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full lg:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white'
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
                <div className='flex w-full justify-center xs:flex-wrap sm:flex-nowrap gap-2 '>
                  <input
                    className='appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full lg:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white'
                    type='text'
                    value={formData.subject}
                    placeholder='Subject'
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        subject: e.target.value,
                      });
                    }}
                  />
                  <input
                    className=' xs:mt-2 sm:mt-0 appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full lg:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white'
                    type='text'
                    placeholder='Contact #'
                    maxLength={12}
                    minLength={8}
                    value={formData.number}
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
                </div>

                <div className='flex w-full justify-center xs:flex-wrap sm:flex-nowrap gap-4 '>
                  <textarea
                    value={formData.request}
                    name='request'
                    className='request flex flex-grow h-full w-full shadow appearance-none border rounded-lg py-2 px-3 text-white bg-black-250 leading-tight focus:outline-none focus:shadow-outline sm:text-lg'
                    rows={6}
                    placeholder='request'
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        request: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className='flex w-full justify-end xs:flex-wrap sm:flex-nowrap mb-0 '>
                  <button
                    className='bg-blue-250 text-white font-semibold hover:bg-red-700 py-1 px-6 border-2 border-blue-250 hover:border-transparent rounded-full tracking-widest text-sm '
                    disabled={loading}
                  >
                    SEND
                  </button>
                </div>
              </form>
            </div>
            <div className='w-full flex flex-col justify-center p-2 text-center'>
              <h1 className='w-full text-xl text-blue-250 mb-2'>
                Hcuisine Tomas Morato
              </h1>
              <div>
                <p>
                  mobile 1:{' '}
                  <span className='text-red-600'>
                    {defaultNum ? defaultNum : '09080808000'}
                  </span>
                </p>
                <p>
                  mobile 2: <span className='text-red-600'>0901-241-2232</span>
                </p>
                <p>
                  email:{' '}
                  <span className='text-red-600'>hcuisine@gmail.com</span>
                </p>
                <p>
                  Address:
                  <span className='text-red-600'>
                    64 Scout Rallos St. Tomas Morato, Quezon City.
                  </span>
                </p>
                <div className='w-full mt-2 flex justify-center'>
                  <a
                    href='https://maps.app.goo.gl/yURQomRg59a3qa9A8'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <img
                      src={hmap}
                      width={'350px'}
                      alt='64 Scout Rallos St. Tomas Morato'
                    />
                  </a>
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

export default Contact;
