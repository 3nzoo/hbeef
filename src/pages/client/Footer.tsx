export const Footer = () => {
  const handleClick = () => {
    window.open(
      'https://www.facebook.com/hannahbsbeef',
      '_blank',
      'noreferrer'
    );
  };

  return (
    <div className='footer flex items-center justify-center left-0 right-0 bottom-2 fixed md:flex md:items-center md:justify-center overflow-hidden text-xs pt-20 -z-10'>
      © 2022 hcuisine.store by{' '}
      <button onClick={handleClick}>
        <span className='text-indigo-500 pl-1 cursor-pointer hover:text-blue-250'>
          Hannah B's Beef
        </span>
      </button>
      <div className='absolute right-8 z-10 top-0 xs:hidden md:block flex max-[20px] flex-wrap'>
        Follow Us!
        <button>
          <span>Icon FB</span>
        </button>
        <button>
          <span>Icon IG</span>
        </button>
      </div>
    </div>
  );
};
