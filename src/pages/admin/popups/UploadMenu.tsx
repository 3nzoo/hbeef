import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../redux/hooks';
import { toggleUpload } from '../../../redux/popUpSlice';
import isEmpty from '../../../validator/is-empty';
import ErrorComponent from '../../../components/common/Error';
import SuccessComponent from '../../../components/common/Success';
import { fileParams, s3 } from '../../../aws/file';
import AWS, { S3 } from 'aws-sdk';
import { updateCredentials } from '../../../hooks/useDynamoDBData';
import { config } from '../../../config';

updateCredentials();

interface UploadFormData {
  name: string;
}

const folderPath = 'pdf/';

const UploadMenu = () => {
  const [pdfList, setPdfList] = useState<any>({});
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    name: '',
  });

  const [newError, setNewError] = useState(false);
  const [errorMsg, setNewErrorMsg] = useState('');
  const [newSuccess, setNewSuccess] = useState('');
  const fileRef = useRef<HTMLInputElement>(null!);

  const dispatch = useAppDispatch();
  const [initiate, setInitiate] = useState(false);

  //? GETPDF
  const getAllpdf = async () => {
    const params = {
      Bucket: config.aws_bucket,
      Prefix: folderPath,
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

  const clearFile = () => {
    fileRef.current.value = '';
  };

  //?DOWNLOAD PDF HERE
  const downloadPdf = async (
    item: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    try {
      const s3 = new AWS.S3();
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
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  //? DELETE PDF
  const deletePdf = async (
    item: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const ss3 = new AWS.S3({ apiVersion: '2021-08-06' });

    const params = {
      Bucket: config.aws_bucket,
      Key: `pdf/${item}`,
    };

    await ss3.deleteObject(params, (err: any, data: any) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        clearFile();
        setNewSuccess(`You have Deleted ${item}`);
        getAllpdf();
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getAllpdf();
    const addClass = setTimeout(() => {
      setInitiate(true);
    }, 10);

    return () => {
      clearTimeout(addClass);
    };
  }, [initiate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (image) {
      const keyName = `pdf/${image.name}`;
      setLoading(true);

      fileParams.Key = keyName;
      fileParams.Body = image;

      try {
        await s3.upload(fileParams, (err: Error, data: any) => {
          if (err) {
            console.log(err);
          } else {
            clearFile();
            setLoading(false);
            setNewSuccess(`You have Successfully added ${image.name}`);
            getAllpdf();
          }
        });
      } catch (err) {
        setNewSuccess('');
        console.log('Error loading image: ' + err);
      }
    }
  };

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement | EventTarget>
  ) => {
    const result = (e.target as HTMLInputElement).files;
    if (result?.length) {
      setImage(result[0]);
      setFormData({
        ...formData,
        name: result[0].name,
      });
    }
  };

  const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      return dispatch(toggleUpload());
    }
  };

  return (
    <div
      className={
        `bg-gray-900 bg-opacity-80 flex content-center items-center justify-center fixed w-full h-full z-30 backdrop-blur-sm transition-opacity duration-500 ${
          initiate && ' opacity-100 '
        }` + `${!initiate && ' opacity-0'}`
      }
      onClick={closeForm}
    >
      <form
        onSubmit={handleSubmit}
        className={
          `bg-white p-6 rounded-lg shadow-md min-w-[20%] transition-transform duration-500 ${
            initiate && ' translate-y-0 '
          }` + `${!initiate && ' -translate-y-10'}`
        }
      >
        <div className='flex justify-between'>
          <h1 className='text-lg mb-4 text-'>Upload New Menu (PDF)</h1>
          <AiOutlineCloseCircle
            className='cursor-pointer hover:text-red-500'
            size={26}
            onClick={() => dispatch(toggleUpload())}
          />
        </div>

        <div className='mb-3'>
          <input
            className=' block w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 file:bg-gray-600 file:border-0 file:cursor-pointer file:text-white file:p-2 file:rounded-tl-lg file:rounded-bl-md file:px-4'
            type='file'
            onChange={handleUpload}
            accept={'.pdf'}
            ref={fileRef}
            // accept={'image/*'}
          />

          <p className='mt-1 text-sm text-gray-900'>PDF only (MAX. 20mb).</p>
        </div>

        <div className='my-1 '>
          <label className='my-4 block text-gray-700 mb-2 font-bold'>
            Existing Pdf Files
          </label>

          <div className='flex w-full overflow-auto h-80 border border-gray-800 mb-3'>
            <div className='h-full w-full'>
              <table className='w-full border-1 border-gray-200'>
                <thead className='sticky top-0 bg-white border h-12 '>
                  <tr className='text-sm font-medium text-gray-700 border border-gray-200 '>
                    <td className='px-3 text-center border border-gray-200'>
                      <span>Pdf Name</span>
                    </td>
                    <td className='px-3 text-center'>
                      <span>Action</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {pdfList.length > 0 &&
                    pdfList.map((item: string, index: number) => (
                      <tr className='border-b border-gray-200' key={index}>
                        <td className='text-center text-sm backdrop:gap-x-4 p-3'>
                          <span>{item}</span>
                        </td>
                        <td className='text-center'>
                          <button
                            className=' xs:text-xs md:text-xs p-2 hover:rounded-md hover:bg-indigo-800 bg-indigo-600 mx-1 text-white rounded-lg'
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                              downloadPdf(item, e)
                            }
                          >
                            <span> Download</span>
                          </button>
                          <button
                            className=' xs:text-xs md:text-xs p-2 hover:rounded-md mx-1 hover:bg-red-800 bg-red-600 text-white rounded-lg'
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                              deletePdf(item, e)
                            }
                          >
                            <span>DELETE</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {newError && <ErrorComponent message={errorMsg} />}
        {newSuccess && <SuccessComponent message={newSuccess} />}

        <button
          disabled={loading}
          className='bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-800 float-right mt-2 px-5 disabled:bg-gray-600'
        >
          Upload PDF
        </button>
      </form>
    </div>
  );
};

export default UploadMenu;
