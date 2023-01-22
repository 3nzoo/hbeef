import React, { useState } from 'react';
// import './Testing.css';

interface TestingProps {
  getfunc: () => void;
}

export const TryThis = ({ getfunc }: TestingProps) => {
  const [result, setResult] = useState<string | null>(null);

  const handleClick = () => {
    console.log(typeof getfunc());
    setResult(String(getfunc()));
  };

  return (
    <>
      <svg
        className={'stroke-cyan-500 fill-none stroke-2'}
        viewBox='0 0 512 512'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill='currentColor'
          d='M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM11,7a1,1,0,0,1,2,0v6a1,1,0,0,1-2,0Zm1,12a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,19Z'
        />
      </svg>
      <button onClick={handleClick}>click</button>
      {result && <span>{result}</span>}
    </>
  );
};

const Testing: React.FC<TestingProps> = () => {
  return (
    <div className='bg-gray-200'>
      Testing
      <TryThis getfunc={() => 'heya'} />
    </div>
  );
};

export default Testing;
