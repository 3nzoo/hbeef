import React from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
type Props = {
  message: string;
};

const SuccessComponent = (props: Props) => {
  return (
    <div className='flex items-center bg-green-500 text-white text-sm font-bold px-4 py-3 mb-5 rounded-lg justify-center'>
      <AiFillCheckCircle className='inline mr-2' />
      <p>{props.message} </p>
    </div>
  );
};

export default SuccessComponent;
