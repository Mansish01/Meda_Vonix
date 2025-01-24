import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (): void =>{
        navigate('/login');
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-800 text-white px-4">
        <h2 className="text-3xl font-bold mb-8">Sign In</h2>
        <form 
          onSubmit={handleSubmit}
          className="bg-white text-black rounded-lg p-8 shadow-lg w-full max-w-md space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="block text-base font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Manish Kumar"
              required
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
  
          <div className="space-y-2">
            <label htmlFor="age" className="block text-base font-medium text-gray-700">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="e.g. 25"
              required
              min="1"
              max="150"
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
  
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-base font-medium text-gray-500">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              required
        
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="" className='text-gray-500'>Select Gender</option>
              <option value="male" className='text-gray-500'>Male</option>
              <option value="female" className='text-gray-500'>Female</option>
              <option value="other" className='text-gray-500'>Other</option>
            </select>
          </div>
  
          <div className="space-y-2">
            <label htmlFor="email" className="block text-base font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. manish@example.com"
              required
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
  
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-base font-medium text-gray-700">
              Phone Number:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="e.g. +1234567890"
              required
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
  
          <div className="space-y-2">
            <label htmlFor="password" className="block text-base font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="e.g. @#$#MNH&78"
              required
        
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
  
          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 font-semibold"
          >
            Sign In
          </button>
  
          <div className="text-center space-y-4">
            <p className="text-sm">Or Sign In With</p>
            <div className="flex justify-center w-full space-x-4">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  try {
                    const token = credentialResponse.credential;
                    if(!token) {
                      throw new Error('No token found');
                    }
                    const decode = jwtDecode(token);
                    console.log('Decoded Token', decode);
                    navigate('/');
                  } catch (error) {
                    console.error('Error', error);
                  }
                }}
              />
 

              {/* <button 
            type="button" 
            onClick={handleSubmit}
            className="py-2 px-7 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold"
            >
            Google
            </button> */}
        {/* <button 
            
            type="button" 
            onClick={handleSubmit}
            className="py-2 px-4 bg-blue-800 text-white rounded-md hover:bg-blue-900 font-semibold w-[42%]"
            >
            Facebook
            </button> */}
      </div>
    </div>
  </form>
</div>
    );
};

export default SignUp;