import React from 'react';
import { assets } from '../../assets/assets';

const Companies = () => {
  return (
    <div className="pt-16">
      <p className="text-base text-gray-500">Trusted by learners from</p>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5">
        <img className='md:w-28 w-20' src={assets.microsoft_logo} alt="Microsoft" />
        <img className='md:w-28 w-20' src={assets.walmart_logo} alt="Walmart" />
        <img className='md:w-24 w-20' src={assets.accenture_logo} alt="Accenture" />
        <img className='md:w-24 w-20' src={assets.adobe_logo} alt="Adobe" />
        <img className='md:w-24 w-20' src={assets.paypal_logo} alt="Paypal" />
      </div>
    </div>
  );
};

export default Companies;
