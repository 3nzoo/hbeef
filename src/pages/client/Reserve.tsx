import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getDataFromDynamo } from '../../hooks/useDynamoDBData';
import { useClientAppSelector } from '../../redux/hooks';
import AWS from 'aws-sdk';
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuccessPage from './RequestSent';
import LoadingPage from '../../components/common/Loading';
import { config } from '../../config';

const d = new Date();
const dayToday = d.getDay();

const sns = new AWS.SNS({
  region: config.aws_region,
  apiVersion: '2010-03-31',
});

export const timeOptions = [
  { disabled: true, label: 'Time', value: '' },
  { label: '11:00 am', value: '11:00 am' },
  { label: '12:00 nn', value: '12:00nn' },
  { label: '1:00 pm', value: '1:00 pm' },
  { label: '2:00 pm', value: '2:00 pm' },
  { label: '3:00 pm', value: '3:00 pm' },
  { label: '4:00 pm', value: '4:00 pm' },
  { label: '5:00 pm', value: '5:00 pm' },
  { label: '6:00 pm', value: '6:00 pm' },
  { label: '7:00 pm', value: '7:00 pm' },
];

if (dayToday > 4) {
  timeOptions.push(
    { label: '8:00 pm', value: '8:00 pm' },
    { label: '9:00 pm', value: '9:00 pm' },
    { label: '10:00 pm', value: '10:00 pm' }
  );
}

interface ReserveFormData {
  name: string;
  number: string;
  selectedDate: any;
  time: string;
  guests: string;
  request: string;
}

const Reserve = () => {
  const [loading, setLoading] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [excludeDates, setExcludeDates] = useState<any>([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<ReserveFormData>({
    name: '',
    number: '',
    selectedDate: new Date(),
    time: '',
    guests: '',
    request: '',
  });
  // const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);
  const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);

  useEffect(() => {
    const fetchData = async () => {
      const new_data = await getDataFromDynamo(config.aws_dateTable);

      if (new_data) {
        // setExcludeDates({ ...excludeDates, new_data });
        const result = new_data.map((item) => new Date(item.date));

        if (result) setExcludeDates(result);

        setRerender(false);
      }
    };

    fetchData();
  }, [rerender]);

  const selectOptions = timeOptions.map((option) => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));

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
    const { request, ...rest } = formData;

    if (Object.values(rest).some((value: any) => value.toString() === '')) {
      return toast.error('All fields are required except the Request field.', {
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

    setLoading(true);
    const date = new Date(formData.selectedDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    const params: any = {
      Message: `\nN: ${formData.name},\nC: ${formData.number},\nD: ${month}-${day}-${year},\nG: ${formData.guests},\nT: ${formData.time},\nR: ${formData.request}`,
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

  if (success) {
    return <SuccessPage isTypeof='reserve' onClick={handleClickClose} />;
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
          <h1 className='text-red-250 xs:text-xl sm:text-2xl md:text-4xl'>
            • Make Your Reservation •
          </h1>
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
                type='number'
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
            </div>
            <div className='flex w-full justify-center xs:flex-wrap sm:flex-nowrap mb-1 gap-4 '>
              <DatePicker
                className='flex shadow border py-2 px-3 w-full text-white bg-black-250 leading-tight focus:outline-none focus:shadow-outline rounded-lg sm:text-lg min-w-[40%] '
                selected={formData.selectedDate}
                minDate={new Date()}
                onChange={(dateNow: any) => {
                  setFormData({
                    ...formData,
                    selectedDate: dateNow,
                  });
                }}
                excludeDates={excludeDates}
              />

              <select
                className='shadow  appearance-none w-full border bg-black-250 rounded-lg px-3 text-white py-2 sm:text-lg text-lg outline-none min-w-[30%]'
                value={formData.time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    time: e.target.value,
                  })
                }
              >
                {selectOptions}
              </select>
              <input
                className='appearance-none grow bg-black-250 rounded-lg text-white p-2 px-3 xs:w-full md:w-1/2 shadow leading-tight focus:outline-none focus:shadow-outline sm:text-lg min-w-[20%] placeholder-white'
                type='number'
                maxLength={3}
                minLength={1}
                value={formData.guests}
                onChange={(e) => {
                  if (
                    !isNaN(Number(e.target.value)) &&
                    Number(e.target.value) > 0 &&
                    e.target.value.length < 4
                  ) {
                    setFormData({
                      ...formData,
                      guests: e.target.value,
                    });
                  }
                }}
                placeholder='Guest #'
              />
            </div>

            <div className='flex w-full justify-center xs:flex-wrap sm:flex-nowrap mb-3 gap-4 '>
              <textarea
                value={formData.request}
                name='request'
                className='request flex flex-grow h-full w-full shadow appearance-none border rounded-lg py-2 px-3 text-white bg-black-250 leading-tight focus:outline-none focus:shadow-outline sm:text-lg placeholder-white::placeholder'
                rows={4}
                placeholder={'Request'}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    request: e.target.value,
                  });
                }}
              />
            </div>
            <div className='flex w-full justify-end xs:flex-wrap sm:flex-nowrap mb-3 gap-4 '>
              <button
                className='bg-blue-250 text-white font-semibold hover:bg-red-700 py-1 px-6 border-2 border-blue-250 hover:border-transparent rounded-full text-sm cursor-pointer disabled:bg-gray-700'
                disabled={loading}
              >
                SEND
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

export default Reserve;
