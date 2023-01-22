import React, { useState } from 'react';
import SideBar from '../../components/common/SideBar';

const Reservation = () => {
  return (
    <section className='flex gap-6'>
      <SideBar />
      <div className='m-3 text-xl text-gray-900 font-semibold'>
        Reservation here
      </div>
    </section>
  );
};

export default Reservation;
