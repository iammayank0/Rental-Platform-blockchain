import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
 
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });


      localStorage.setItem('token', res.data.token);
      alert('Login Successful');


    } catch (error) {

      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className=" p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl  text-gray-100 font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-100 text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              value={email}
              placeholder='example@ex.com'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm   text-gray-100 font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              value={password}
              placeholder='Enter password'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}
          <div className='text-center'>
              <button
                type="submit"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
          </div>

        </form>

        <div className='mt-3'>
          <Link to = '/register' className='text-blue-400' ><span>Register a new user</span></Link>
            {/* <a href='/register' className='text-blue-400 '>Register a new user?</a> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
