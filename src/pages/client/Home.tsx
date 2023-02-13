import { useState } from 'react';
import Banner from './Banner';

import beef from '../../assets/beef.jpg';

const Home = () => {
  const [bannerState, setBannerState] = useState(false);

  const handleClickBanner = (): void => {
    setBannerState(!bannerState);
  };

  // const imgUrl = s3.getSignedUrl('getObject', {
  //   ...getFileParams,
  //   Key: 'menu/' + item.img_Url,
  // });

  return (
    <div className='h-auto flex w-auto xs:mb-10 md:mb-0 xs:mt-44 md:mt-42 lg:mt-40 flex-wrap content-center flex-col'>
      {!bannerState && (
        <section className='mb-auto text-center'>
          <div className='flex justify-center'>
            <h1 className='w-auto content-center my-1 font-dance text-blue-250 home-title text-center tracking-[.08em] xs:text-3xl md:text-4xl xs:leading-[40px] md:leading-[4rem]'>
              Welcome To the <br /> Home of the Most Awesome <br /> Angus Beef
              Belly
            </h1>
          </div>
          <div className=' flex content-center justify-center my-4'>
            <div className='food-border flex border-solid border-blue-250 border-4 rounded'>
              <img
                src={beef}
                width='300px'
                alt='Logo'
                className='xs:w-[300px] md:w-[499px]'
              />
            </div>
          </div>
          <button
            className='bg-blue-250  hover:bg-white text-white  font-semibold hover:text-blue-250 py-1 px-5 border-2 border-blue-250 hover:border-blue-250 hover:backdrop-blur-xl rounded-full mt-3 text-base tracking-wide'
            onClick={handleClickBanner}
          >
            About us
          </button>
        </section>
      )}
      {bannerState && <Banner onClick={handleClickBanner} />}
    </div>
  );
};

export default Home;
