import { useState, useContext } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { Toaster } from 'react-hot-toast';

const Login = () => {
  const [eye, setEye] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, pass } = e.target.elements;
    if (pass.value.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    await signIn(email.value, pass.value, setError, navigate);
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>MoneyMate - Login</title>
      </Helmet>
      <Toaster/>
      <div className='min-h-[90vh] bg-[#F6F5F0] flex justify-center items-center p-4'>
        <div className="container bg-white rounded-xl flex flex-col lg:flex-row justify-between w-full lg:w-4/5 h-auto lg:min-h-[70vh] overflow-hidden shadow-lg">
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-blue-950 relative h-64 lg:h-auto p-4">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <h1 className="text-white text-5xl xl:text-7xl font-bold text-center">
                <span className='text-green-500'>MoneyMate</span> <br/>
                <span className='text-xl lg:text-2xl'>Welcome Back.</span>
              </h1>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center">
            <h2 className='text-2xl mb-6 font-semibold text-blue-950'>Login</h2>
            
            <form className='space-y-4 w-full max-w-sm' onSubmit={handleLogin}>
              <div>
                <label className='block mb-1 text-gray-600'>Email</label>
                <input name='email' type='email' className='w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required />
              </div>
              <div>
                <label className='block mb-1 text-gray-600'>Password</label>
                <div className="relative">
                  <input name='pass' type={eye ? "text" : "password"} className='w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setEye(!eye)}>
                    {eye ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>
              <button type='submit' className='w-full py-2 hover:bg-green-600 bg-blue-950 text-white rounded-md transition duration-300' disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
              {error && <p className='text-red-400 mb-4 text-sm'>{error}</p>}
            </form>
            <div className="mt-6 w-full max-w-sm flex justify-between">
              <p>Dont have an account?</p>
              <Link to="/register" className="text-blue-950 border-[1px] px-1 border-blue-950 rounded-md hover:shadow-lg">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
