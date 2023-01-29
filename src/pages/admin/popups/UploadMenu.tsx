import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../redux/hooks';
import {
  toggleCategory,
  toggleProd,
  toggleUpload,
} from '../../../redux/popUpSlice';
import isEmpty from '../../../validator/is-empty';
import ErrorComponent from '../../../components/common/Error';
import SuccessComponent from '../../../components/common/Success';
import { fileParams, s3 } from '../../../aws/file';

//TODO add clickable menu on the list that will download and open the pdf file
//TODO add the upload file to aws
// TODO create a Table for menu file. fields will be id, name, url

const pdfFileList = [
  'Daily_Specials_Menu.pdf',
  'Brunch_Menu.pdf',
  'Vegetarian_Options.pdf',
  'Dessert_Menu.pdf',
  'Kids_Menu.pdf',
  'Takeout_Menu.pdf',
  'Seasonal_Menu.pdf',
  'Drink_Menu.pdf',
  'Food_Truck_Menu.pdf',
  'Fine_Dining_Menu.pdf',
];

interface UploadFormData {
  name: string;
}

const UploadMenu = () => {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    name: '',
  });
  const [imgUrl, setImgUrl] = useState<string>('');

  const [newError, setNewError] = useState(false);
  const [errorMsg, setNewErrorMsg] = useState('');
  const [newSuccess, setNewSuccess] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (image) {
      const keyName = `pdf/${Date.now()}-${image.name}`;
      setUploading(true);

      fileParams.Key = keyName;
      fileParams.Body = image;

      try {
        await s3.upload(fileParams).promise();

        const getParams = {
          Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
          Key: keyName,
          Expires: 0,
        };

        const url = await s3.getSignedUrl('getObject', getParams);
        //! this LiNK will be the download file
        console.log('urel', url);
        setImgUrl(url);

        setUploading(false);
        setNewSuccess(true);
      } catch (err) {
        setUploading(false);
        console.log('Error uploading image: ' + err);
      }
    }

    if (isEmpty(formData.name)) console.log('formData', formData);

    const filtered = Object.entries(formData).filter(([key, value]) =>
      isEmpty(value)
    );

    console.log('filtered', filtered);

    try {
      if (filtered.length !== 0) {
        setNewErrorMsg('Select pdf file from your computer.');
        setNewSuccess(false);
        return setNewError(true);
      }
      pdfFileList.push(formData.name);
      setNewError(false);
      setNewSuccess(true);
      setFormData({ ...formData, name: '' });
    } catch (err) {
      console.log(err);
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

  return (
    <div className='bg-gray-900 bg-opacity-80 flex content-center items-center justify-center fixed w-full h-full z-10'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md min-w-[20%]'
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
            // accept={'.pdf'}
            accept={'image/*'}
          />

          <p className='mt-1 text-sm text-gray-900'>PDF only (MAX. 20mb).</p>
        </div>

        <div className='mb-1'>
          <label className='block text-gray-700 mb-2'>Existing Pdf Files</label>
          <div className='flex w-full'>
            <div className='mb-3 w-full'>
              <div className='h-full w-full'>
                <select
                  defaultValue={0}
                  size={5}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 min-h-60'
                  onChange={(e) => console.log('yets', e.target.value)}
                >
                  <option value={0}>- Pdf File List -</option>
                  {pdfFileList.map((item: string, index: number) => (
                    <option
                      value={item + 'haha'}
                      className='disabled: text-white'
                      key={index}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {newError && <ErrorComponent message={errorMsg} />}
        {newSuccess && (
          <SuccessComponent message='You have successfully uploaded' />
        )}

        <button
          disabled={uploading}
          className='bg-blue-550 text-white p-3 rounded-lg hover:bg-indigo-600 float-right mt-5'
        >
          Upload PDF
        </button>

        <img src={imgUrl} alt='test' width='200' height='200' />
      </form>
    </div>
  );
};

export default UploadMenu;
