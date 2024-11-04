// list of categories
import { useEffect, useRef, useState } from 'react';
import { useClientAppSelector } from '../../../redux/hooks';
import AWS from 'aws-sdk';
import FoodCard from './FoodCard';
import {
  updateCredentials,
  useDynamoCategories,
} from '../../../hooks/useDynamoDBData';

import { getFileParams, s3 } from '../../../aws/file';
import LoadingPage from '../../../components/common/Loading';
import Food from './Food';
import { config } from '../../../config';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

updateCredentials();

const Menu = () => {
  const [loading, setLoading] = useState(false);
  const navIsOpen = useClientAppSelector((state) => state.toggle.navIsOpen);
  const [defaultFood, setDefaultFood] = useState('');
  const [initiate, setInitiate] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    'de1476c1-dc04-4bfd-8cde-3722e836c33d'
  );
  const [foodIsOpen, setFoodIsOpen] = useState(false);
  const [currCategory, setCurrCategory] = useState('Beef');
  const [pdfList, setPdfList] = useState<any>([]);

  const effectRan = useRef(false);

  const showFood = (foodData: any) => {
    setDefaultFood(foodData);
    setFoodIsOpen(!foodIsOpen);
  };

  const getAllpdf = async () => {
    const params = {
      Bucket: config.aws_bucket,
      Prefix: 'pdf/',
    };

    await s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const list = data.Contents?.map((item) => {
          // console.log(item.Key?.substring(4));
          return item.Key?.substring(4);

          // setPdfList({ ...pdfList, key: item.Key?.substring(4) });
        });

        if (list) {
          setPdfList(list);
        }
      }
    });
  };

  const downloadPdf = async (
    item: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const params = {
        Bucket: config.aws_bucket,
        Key: `pdf/${item}`,
      };
      const data: any = await s3.getObject(params).promise();
      const blob = new Blob([data.Body], { type: data.ContentType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = item;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const params = {
      TableName: config.aws_menu,
      FilterExpression: 'category_id = :val',
      ExpressionAttributeValues: {
        ':val': selectedCategory,
      },
    };

    if (effectRan.current === true) {
      dynamoDB.scan(params, (err: any, data: any) => {
        if (err) {
          console.error('Error:', err);
        } else {
          setDataList(data.Items);
        }
        setLoading(false);
      });
    }

    return () => {
      effectRan.current = true;
    };
  }, [selectedCategory]);

  useEffect(() => {
    if (effectRan.current === true) {
      if (effectRan.current === true) {
        dynamoDB.scan(
          { TableName: config.aws_category },
          (err: any, data: any) => {
            if (err) {
              console.error('Error:', err);
            } else {
              const test = data.Items.sort((a: any, b: any) => {
                if (a.id === selectedCategory) {
                  return -1;
                }
                if (b.id === selectedCategory) {
                  return 1;
                }
                return a.id.localeCompare(b.id);
              });

              if (test) {
                setCategoriesList(test);
              }
            }
          }
        );
      }
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  useEffect(() => {
    if (effectRan.current === true) getAllpdf();

    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      effectRan.current = true;
      clearTimeout(addClass);
    };
  }, [initiate]);

  const handleClose = () => {
    setFoodIsOpen(!foodIsOpen);
  };

  if (foodIsOpen) {
    return (
      <div className='h-screen flex flex-wrap content-center flex-col p-2 z-30'>
        <Food data={defaultFood} onClick={handleClose} />
      </div>
    );
  }

  return !navIsOpen ? (
    <div className='h-screen flex flex-wrap content-center flex-col p-2 z-30'>
      {loading && <LoadingPage />}
      {/* {foodIsOpen && <Food data={defaultFood} onClick={handleClose} />} */}
      <section
        className={
          `flex flex-col justify-center mb-10 xs:mt-36 sm:mt-40 bg-white bg-opacity-50 mx-3 rounded-2xl max-w-[920px] w-full backdrop-blur-sm xs:max-h-[64%] sm:max-h-[68%] md:max-h-[70%] lg:max-h-[75%] transition-opacity duration-500 ${
            initiate && ' opacity-100 '
          }` + `${!initiate && ' opacity-0'}`
        }
      >
        <div
          className={
            `flex flex-col border-blue-250 border-8 rounded-2xl max-h-[100%] justify-center text-center xs:py-2 md:py-3` +
            ` w-full transition-transform duration-500 ${
              initiate && ' translate-y-0 '
            }` +
            `${!initiate && ' -translate-y-10'}`
          }
        >
          <h1 className='text-red-250 xs:text-2xl sm:text-3xl md:text-4xl xs:mb-2 xs:mt-2 md:mb-1'>
            • Menu •
          </h1>
          <div className='flex-row w-auto text-center m-auto text-blue-250 mb-3 xs:hidden md:flex mt-2 px-10'>
            {categoriesList.length < 10 &&
              categoriesList.map((category: any, index) => (
                <button
                  className={
                    ` px-3 text-sm py-1` +
                    ` ${
                      index === categoriesList.length - 1
                        ? 'border-none'
                        : 'border-r-2 border-blue-250'
                    }` +
                    `${
                      category.id === selectedCategory
                        ? ' text-white hover:bg-blue-900 bg-blue-250'
                        : ''
                    }`
                  }
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                  }}
                >
                  {category.name}
                </button>
              ))}
          </div>
          <div
            className={
              `justify-center flex-1 w-auto text-center m-auto items-center text-blue-250 mb-3 xs:flex px-2 ` +
              `${categoriesList.length >= 10 ? 'md:flex' : 'md:hidden'} `
            }
          >
            <label className='text-gray-600 text-sm mr-2 xs:mt-2 sm:mt-0'>
              select Category:
            </label>
            <select
              className='bg-transparent text-blue-250 text-base border-2 border-blue-250 p-1 max-w-[60%] min-w-[30%] w-auto xs:mt-2 sm:mt-0'
              defaultValue={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categoriesList.length > 0 &&
                categoriesList.map((category: any, index: number) => {
                  return (
                    <option key={index} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className='h-screen flex flex-col w-auto max-h-[76%] '>
            <div className='flex-1 overflow-y-scroll'>
              <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:p-1 md:p-4'>
                {dataList.length > 0 &&
                  dataList.map((food: any) => {
                    const imgUrl = s3.getSignedUrl('getObject', {
                      ...getFileParams,
                      Key: 'menu/' + food.img_Url,
                    });

                    return (
                      <FoodCard
                        key={food.id}
                        data={{ ...food, img_Url: imgUrl }}
                        showFood={showFood}
                        // onClick={() => console.log('open Product')}
                      />
                    );
                  })}
              </div>
              <div className='h-auto border-t-2 py-5'>
                <h1 className='text-red-250 xs:text-xl sm:text-2xl md:text-3xl xs:mb-2 mt-2 md:mb-1'>
                  • Downloadable Menu (PDF) •
                </h1>
                <div className='flex-row w-auto text-center m-auto text-blue-250 mb-3 flex-wrap flex  sm:px-16 xs:px-4'>
                  {pdfList.length > 7 &&
                    pdfList.map((pdf: any, index: number) => (
                      <button
                        className={
                          ` px-3 xs:text-xs sm:text-base py-1 my-2` +
                          ` ${
                            index === pdfList.length - 1
                              ? 'border-none'
                              : 'border-r-2 border-blue-250'
                          }`
                        }
                        key={index}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          downloadPdf(pdf, e);
                        }}
                      >
                        {pdf}
                      </button>
                    ))}
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

export default Menu;
