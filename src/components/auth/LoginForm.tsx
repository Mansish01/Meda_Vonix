import { useState } from "react";
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import React from "react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  const handleGoogleSuccess = async (tokenResponse: TokenResponse) => {
    const accessToken = tokenResponse.access_token;
    setIsLoading(true);
    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (!userInfoResponse.ok) throw new Error('Failed to get user info');
      const userInfo = await userInfoResponse.json();
      console.log('Google User Info:', userInfo);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.log('Google Login Failed'),
  });

  return (
    <section className="min-h-screen flex items-center justify-center relative">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://i.ibb.co/bMQSZhhR/happy-female-doctor-giving-high-fie-little-boy-who-came-with-father-hospital.jpg')`
        }}
      >
        {/* Overlay with color and opacity */}
        <div className="absolute inset-0 bg-[#1E5631] opacity-80"></div>
      </div>

      {/* Content */}
      <div className="w-2/3 flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 relative z-10">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white font-belleza">
          <img className="w-8 h-8 mr-2" src="https://i.ibb.co/6RGt3CCZ/Minimalist-Hospital-and-Medical-Health-Logo.png" alt="logo" />
          Mero Doctor    
        </a>
        <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-white/10 backdrop-blur-sm">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-white">Your email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="samyam@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-white">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="@#$#MNH&78"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-3 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      id="remember" 
                      aria-describedby="remember" 
                      type="checkbox" 
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-white hover:underline">Forgot password?</a>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-[#1E5631] hover:bg-[#174627] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-sm font-light text-white">
                Don't have an account yet? <a href="/signup" className="font-medium hover:underline">Sign up</a>
              </p>
              <div className="flex items-center">
                <div className="flex-1 h-0.5 bg-gray-300"></div>
                <p className="mx-4 text-gray-300">or</p>
                <div className="flex-1 h-0.5 bg-gray-300"></div>
              </div>
              <button
                type="button"
                onClick={() => googleLogin()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
              >
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                  <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd"/>
                </svg>
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;