import React, { useEffect, useState } from 'react';
import SideBar from '../../components/common/SideBar';
import { BsKeyFill } from 'react-icons/bs';
import {
  toggleAddContact,
  toggleConfirmDelete,
  togglePassword,
} from '../../redux/popUpSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import AddContacts from './popups/AddContact';
import { AiFillPhone } from 'react-icons/ai';
import { getDataFromDynamo } from '../../hooks/useDynamoDBData';
import { updateCredentials } from '../../hooks/useDynamoDBData';
import 'react-toastify/dist/ReactToastify.css';
import AWS from 'aws-sdk';
import ConfirmPage from '../../components/common/Confirm';
import ChangePassword from './popups/ChangePassword';
import { Flip, toast, ToastContainer } from 'react-toastify';

const sns = new AWS.SNS({
  region: import.meta.env.VITE_AWS_REGION,
  apiVersion: '2010-03-31',
});

const Settings = () => {
  const addContactIsOpen = useAppSelector(
    (state) => state.toggling.addContactIsOpen
  );
  const [dataList, setDataList] = useState<any>([]);
  const dispatch = useAppDispatch();
  const [rerender, setRerender] = useState(false);
  const [defaultNum, setDefaultNum] = useState<any>(null);
  const reloadMenu = () => {
    setRerender(true);
  };

  const [currentData, setCurrentData] = useState({});
  const confirmIsOpen = useAppSelector((state) => state.toggling.confirmIsOpen);
  const passwordIsOpen = useAppSelector(
    (state) => state.toggling.passwordIsOpen
  );

  // const subscribe = function (params: any) {
  //   return new Promise((resolve, reject) => {
  //     sns.subscribe(params, (err, data) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(data);
  //       }
  //     });
  //   });
  // };

  // const confirmSubscription = function (params) {
  //   return new Promise((resolve, reject) => {
  //     sns.confirmSubscription(params, (err, data) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(data);
  //       }
  //     });
  //   });
  // };

  const convertToValid = (num: string) => {
    let result = '';
    if (num.substring(0, 2) === '09' || num.substring(0, 2) === '08') {
      return (result = '+63' + num.slice(1));
    } else if (num.substring(0, 2) === '63') {
      return (result = '+' + num);
    } else {
      return toast.error('Invalid Number', {
        position: 'bottom-center',
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
  };

  // const addNewSandbox = async (contact: string) => {
  //   const result: any = convertToValid(contact);

  //   if (result.length > 0) {
  //     console.log(result);

  //     const params = {
  //       Protocol: 'sms',
  //       TopicArn: import.meta.env.VITE_TOPIC_ARN,
  //       Endpoint: result,
  //     };

  //     subscribe(params)
  //       .then((data: any) => {
  //         console.log('Subscription ARN:', data.SubscriptionArn);
  //         console.log('Confirmation Token:', data.ConfirmationToken);

  //         return confirmSubscription({
  //           TopicArn: params.TopicArn,
  //           Token: data.ConfirmationToken,
  //         });
  //       })
  //       .then(() => {
  //         //!! add toast success here
  //         console.log('Subscription confirmed');
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  // sns.subscribe(params, (err, data: any) => {
  //   if (err) {
  //     return console.error('Error: ', err);
  //   } else {
  //     console.log('Data: ', data);
  //     console.log('config', data.ConfirmationToken);

  //     if (data.ConfirmationToken) {
  //       sns.confirmSubscription(
  //         {
  //           TopicArn: import.meta.env.VITE_TOPIC_ARN,
  //           Token: data.ConfirmationToken,
  //         },
  //         (err, data: any) => {
  //           if (err) {
  //             console.error(err);
  //             return;
  //           }
  //           toast.success('Verified:', data);
  //           console.log('Verified: ', data);
  //         }
  //       );
  //     }
  //   }
  // });
  // }
  // };

  //! FOr ORDERING method
  // const runSMS = async () => {
  //   const textThis: any = await convertToValid(
  //     defaultNum.contactnum.replace(/-/g, '')
  //   );

  //   console.log(textThis.slice(1));
  //   const targetIs: any =
  //     import.meta.env.VITE_TOPIC_ARN.replace('hbeef-order', ':endpoint/SMS/') +
  //     textThis.slice(1);

  //   if (targetIs.length > 0) {
  //     console.log('finally--', targetIs);
  //   }
  //   // arn:aws:sns:us-west-2:123456789012:sms/phone-number/12065550123
  //   updateCredentials();
  //   const sns = new AWS.SNS({
  //     region: import.meta.env.VITE_AWS_REGION,
  //     apiVersion: '2010-03-31',
  //   });

  //   // const attributeParams = {
  //   //   attributes: {
  //   //     DefaultSMSType: 'Promotional',
  //   //   },
  //   // };

  //   // const params: any = {
  //   //   Message: 'Hello from SNS!',
  //   //   TargetArn: targetIs,
  //   //   MessageAttributes: {
  //   //     AWSTemplate: {
  //   //       DataType: 'String',
  //   //       StringValue: 'Test Message',
  //   //     },
  //   //   },
  //   // };

  //   // await sns.setSMSAttributes(attributeParams).promise();

  //   //?topiarn
  //   const params: any = {
  //     Message: 'ORDER: Hcuisine test',
  //     TopicArn: import.meta.env.VITE_TOPIC_ARN,
  //   };

  //   await sns.publish(params, (err, data) => {
  //     if (err) {
  //       console.error(err, err.stack);
  //     } else {
  //       console.log(data);
  //     }
  //   });
  // };

  useEffect(() => {
    const fetchData = async () => {
      const new_data = await getDataFromDynamo(
        import.meta.env.VITE_AWS_CONTACT_TABLE
      );

      if (new_data) {
        setDefaultNum(new_data.find((num) => num.isDefault === true));
        setDataList(new_data);
        setRerender(false);
      }
    };

    fetchData();
  }, [rerender]);

  const handleSetDefault = async (
    e: React.MouseEvent<HTMLButtonElement>,
    data: any
  ) => {
    if (!defaultNum && defaultNum === null) {
      return;
    }
    const reducedNum = data.contactnum.replace(/-/g, '');

    if (reducedNum.length < 11) {
      return toast.error('Number must be more than 10 Characters', {
        position: 'bottom-center',
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

    const defcontactnum = defaultNum.contactnum;

    updateCredentials();
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      region: import.meta.env.VITE_AWS_REGION,
    });

    const { contactnum } = data;
    await dynamodb
      .update({
        TableName: import.meta.env.VITE_AWS_CONTACT_TABLE,
        Key: { contactnum: contactnum },
        UpdateExpression: 'SET #isDefault = :isDefault',
        ExpressionAttributeNames: {
          '#isDefault': 'isDefault',
        },
        ExpressionAttributeValues: {
          ':isDefault': true,
        },
      })
      .promise();

    await dynamodb
      .update({
        TableName: import.meta.env.VITE_AWS_CONTACT_TABLE,
        Key: { contactnum: defcontactnum },
        UpdateExpression: 'SET #isDefault = :isDefault',
        ExpressionAttributeNames: {
          '#isDefault': 'isDefault',
        },
        ExpressionAttributeValues: {
          ':isDefault': false,
        },
      })
      .promise();

    reloadMenu();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, item: any) => {
    setCurrentData(item);
    dispatch(toggleConfirmDelete());
  };

  return (
    <>
      {passwordIsOpen && <ChangePassword />}
      {confirmIsOpen && (
        <ConfirmPage currentData={currentData} reloadMenu={reloadMenu} />
      )}

      {addContactIsOpen && <AddContacts reloadMenu={reloadMenu} />}
      <section className='flex overflow-hidden w-full'>
        <SideBar />

        <main className='flex-1 pb-8 xs:max-w-[80%] md:max-w-[50%] h-screen overflow-auto mx-auto my-0 z-20'>
          {/*  */}
          {/* ProductsHeader */}

          <div className='flex items-center justify-between py-3 px-5 mt-3 '>
            <div className='flex flex-row justify-end grow'>
              <button
                className='inline-flex gap-x-2 ml-2 items-center py-2 px-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'
                onClick={() => dispatch(togglePassword())}
              >
                <span className='xs:text-xs md:text-sm font-semibold tracking-wide '>
                  <BsKeyFill className='float-left mr-2 h-5 w-5' /> change
                  Password
                </span>
              </button>
              <button
                className='inline-flex gap-x-2 ml-2 items-center py-2 px-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'
                onClick={() => dispatch(toggleAddContact())}
              >
                <span className='xs:text-xs md:text-sm font-semibold tracking-wide '>
                  <AiFillPhone className='float-left mr-2 h-5 w-5' /> Add Number
                </span>
              </button>
            </div>
          </div>

          {/*  */}
          {/* table */}
          <label className='block bg-blue-550 rounded-lg text-gray-200 my-3 py-2 text-center xs:text-base md:text-xl font-bold'>
            Contact Numbers
          </label>
          <table className='w-full border-b border-gray-200'>
            <thead>
              <tr className='text-sm md:text-lg font-medium text-gray-700 border-b border-gray-200 '>
                <td
                  className='pl-5'
                  // onClick={sortByName}
                >
                  <div className='flex items-center gap-x-4 text-center  '>
                    <span className='xs:mx-auto xs:my-0 md:mx-0 font-bold'>
                      Contact Numbers
                    </span>
                  </div>
                </td>

                <td className='py-4 px-2 text-center font-bold'>Actions</td>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((item: any, index: number) => {
                  return (
                    <tr
                      className='hover:bg-gray-100 transition-colors group sm:text-sm md:text-lg'
                      key={index}
                    >
                      <td className='flex gap-x-4 items-center py-4 md:pl-5 xs:flex-col md:flex-row xs:pl-2'>
                        <div>
                          <div className='font-medium text-gray-700 xs:text-sm sm:text-base text-center md:text-lg xs:mt-3 md:mt-0'>
                            {item.contactnum}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='text-center  text-sm'>
                          {item.isDefault ? (
                            <span> Default Number</span>
                          ) : (
                            <div>
                              <button
                                className='p-2 m-2 hover:rounded-md hover:bg-green-800 bg-green-600 text-white rounded-lg'
                                onClick={(
                                  e: React.MouseEvent<HTMLButtonElement>
                                ) => handleSetDefault(e, item)}
                              >
                                Set Default
                              </button>
                              <button
                                className='p-2 m-2 hover:rounded-md hover:bg-red-800 bg-red-600 text-white rounded-lg'
                                onClick={(e) => handleDelete(e, item)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </main>
        <ToastContainer />
      </section>
    </>
  );
};

export default Settings;
