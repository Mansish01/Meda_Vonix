import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('password', password);
    formData.append('gender', gender);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('age', age);

    try {
      const response = await fetch('/patients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Sign-up failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during sign-up.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-800 text-white px-4">
      <h2 className="text-3xl font-bold mb-8">Sign Up</h2>
      <div className="bg-white text-black rounded-lg p-8 shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-base font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g. Manish Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3"
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
              required
              min="1"
              max="150"
              placeholder="e.g. 25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-base font-medium text-gray-700">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3"
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
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
              required
              placeholder="e.g. manish@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3"
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
              required
              placeholder="e.g. +123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3"
            />
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
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-emerald-500 hover:underline font-medium">
              Login
            </a>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        <div className="mt-6 w-full flex justify-center align-center">
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

export default SignUp;