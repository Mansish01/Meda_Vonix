import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

interface FormData {
  fullname: string;
  age: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    age: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'confirmPassword') {
        submitData.append(key, value);
      }
    });

    try {
      const response = await fetch('/patients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: submitData.toString(),
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
    <section className="min-h-screen flex items-center justify-center relative">
  
    <div className="absolute inset-0 bg-[url('https://i.ibb.co/bMQSZhhR/happy-female-doctor-giving-high-fie-little-boy-who-came-with-father-hospital.jpg')] bg-cover bg-center">
     
      <div className="absolute inset-0 bg-[#1E5631] opacity-80"></div>
    </div>

   
    <div className="w-2/3 flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 relative z-10">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white font-belleza">
        <img className="w-8 h-8 mr-2" src="https://i.ibb.co/6RGt3CCZ/Minimalist-Hospital-and-Medical-Health-Logo.png" alt="logo" />
        Mero Doctor    
      </a>
      <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-white/10 backdrop-blur-sm">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
            Create an account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Full Name:</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-white">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-white">Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="98XXXXXXXX"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-white">Password:</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3 bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-300">
                  I accept the <a href="#" className="font-medium text-white hover:underline">Terms and Conditions</a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-[#1E5631] hover:bg-[#174627] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Create Account
            </button>

            <p className="text-sm font-light text-white">
              Already have an account? <a href="/logindoctor" className="font-medium hover:underline">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
  );
};

export default SignupForm;