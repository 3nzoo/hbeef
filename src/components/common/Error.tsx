import React from 'react';
import { AiFillWarning } from 'react-icons/ai';
type Props = {
  message: string;
};

const ErrorComponent = (props: Props) => {
  return (
    <div className='flex items-center bg-red-500 text-white text-sm font-bold px-4 py-3 mb-5 rounded-lg justify-center'>
      <AiFillWarning className='inline mr-2' />
      <p>{props.message} </p>
    </div>
  );
};

export default ErrorComponent;
