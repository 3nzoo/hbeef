import { useEffect, useState } from 'react';
import { useClientAppSelector } from '../../redux/hooks';
import AWS from 'aws-sdk';

interface OrderSuccess {
  onClick: (e: React.MouseEvent<HTMLOrSVGElement>) => void;
}

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const OrdersComplete = (props: OrderSuccess) => {
  const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);
  const [defaultNum, setDefaultNum] = useState('');
  const [initiate, setInitiate] = useState(false);

  useEffect(() => {
    const params = {
      TableName: import.meta.env.VITE_AWS_CONTACT_TABLE,
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

  return !navIsOpen ? (
    <div className='h-auto flex w-auto mb-0 mt-5 flex-wrap content-center flex-col'>
      <section
        className={
          `flex justify-center mb-10 xs:mt-40 bg-white bg-opacity-50 mx-3 rounded-2xl max-w-[720px] backdrop-blur-sm transition-opacity duration-500 ${
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
          <h1 className='text-red-250 xs:text-3xl md:text-4xl xs:mb-2 md:mb-2 mt-10'>
            • Order Sent •
          </h1>
          <div className='flex flex-col grow h-auto w-full justify-center items-center xs:my-2 sm:my-5 xs:text-sm md:text-lg '>
            <div className='w-auto text-center  '>
              <h1 className=' xs:text-lg sm:text-xl text-blue-250  '>
                THANK YOU!!
              </h1>
              <div className='xs:mt-2 sm:mt-4 leading-[32px] tracking-wide'>
                <div className='xs:px-8 sm:px-16 md:px-20'>
                  <p>
                    Your order has been successfully sent. Kindly wait for our
                    call to confirm your order and get our payment details.
                  </p>
                </div>
              </div>
            </div>
            <div className='w-auto text-center py-5'>
              <div className='text-red-250 leading-[28px]'>
                <p>If you wish to contact us immediately,</p>
                <p>just call or text us at</p>
              </div>
              <div className='text-blue-250 mt-1 xs:px-8'>
                <p>(02) 8642.4862, {defaultNum} or 0917.777.1411</p>
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

export default OrdersComplete;
