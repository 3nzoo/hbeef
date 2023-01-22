import { useState } from 'react';
import Banner from '../components/Banner';
import logo from '/images/logosmall.png';

const Home = () => {
  const [bannerState, setBannerState] = useState(false);

  const handleClickBanner = (): void => {
    setBannerState(!bannerState);
  };

  return (
    <div className='h-auto flex w-auto mb-20 lg:mt-32 mt-5 flex-wrap content-center flex-col'>
      {!bannerState && (
        <section className='mb-auto'>
          <div className='flex justify-center'>
            <h1 className='w-auto content-center xl:text-5xl sm:text-4xl text-2xl my-2 font-dance text-blue-250 home-title'>
              {' '}
              Welcome To the <br /> Home of the Most Awesome <br /> Angus Beef
              Belly
            </h1>
          </div>
          <div className=' flex content-center justify-center my-4'>
            <div className='food-border flex border-solid border-blue-250 border-4 rounded justify-center self-center content-center'>
              <img src={logo} width='350px' alt='Logo' className='' />
            </div>
          </div>
          <button
            className='bg-transparent hover:bg-blue-250 text-blue-700 font-semibold hover:text-white py-1 px-6 border-2 border-blue-250 hover:border-transparent rounded-full mt-4'
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
