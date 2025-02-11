import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const   PatientLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);
  
    try {
      const response = await fetch('/patient/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.doctor_id)
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-800 text-white px-4">
      <h2 className="text-3xl font-bold mb-8">Login</h2>
      <div className="bg-white text-black rounded-lg p-8 shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3"
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
              required
              placeholder="e.g. @#$#MNH&78"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3"
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-emerald-500 hover:underline cursor-pointer">
              Forgot Password?
            </p>
          </div>
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 font-semibold transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-emerald-500 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        <div className=" mt-6  flex justify-center align-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              try {
                const token = credentialResponse.credential;
                if (!token) {
                  throw new Error('No token found');
                }
                const decode = jwtDecode(token);
                console.log('Decoded Token', decode);
                navigate('/');
              } catch (error) {
                console.error('Error', error);
              }
            }}
            theme="outline"
            shape="rectangular"
            text="continue_with"
            useOneTap={false}
            
          />
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;