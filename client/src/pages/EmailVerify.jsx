
import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { useRef } from 'react';


const EmailVerify = () => {

        axios.defaults.withCredentials = true;

  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { backendUrl, getUserData, isLoggedIn, userData } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const inputRefs = React.useRef([]);
 const handleInput = (e, index) => {
  if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
    inputRefs.current[index + 1].focus(); 

  }
 }
  
  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    });
  }

    const onSubmitHandler = (e) => {
      try {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value);
        const otp = otpArray.join('');
        setOtp(otp);  
      } catch (error) {
        toast.error(error.message);
      }
    }

    // Removed invalid top-level await call.
    // The axios call is already handled inside handleSubmit.


  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <form className='bg-slate-900 p-8 rounded-lg w-96 text-sm' onSubmit={handleSubmit}>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
        <div onPaste={handlePaste}>
        {Array(6).fill(0).map((_, index) => (
           <input
          type='text'
          maxLength='1'
          key={index}
          // value={otp}
          // onChange={(e) => setOtp(e.target.value)}
          // placeholder='Enter OTP'
          // className='w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white outline-none'
          className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md m-0.5'
          required
          ref = {e => inputRefs.current[index] = e}
          onInput={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
        ))}
        </div>
       
        <button className='w-full py-3 rounded-full bg-indigo-500 text-white font-medium cursor-pointer'>Verify Email</button>
      </form>
    </div>
  );
};

export default EmailVerify;
