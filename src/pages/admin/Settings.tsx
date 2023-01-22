import React, { useState } from 'react';
import SideBar from '../../components/common/SideBar';

const Settings = () => {
  return (
    <section className='flex gap-6'>
      <SideBar />
      <div className='m-3 text-xl text-gray-900 font-semibold'>
        Settings here
      </div>
    </section>
  );
};

export default Settings;
