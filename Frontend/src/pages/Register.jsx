
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
 
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, email, password, confirmPassword } = userData;
  
    if (password.trim() !== confirmPassword.trim()) {
      setError('Passwords do not match!');
      alert('Passwords do not match!'); 
      return;
    }
  
    console.log('Registering user with:', { name, email, password });
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        confirmPassword, 
      });
  
      if (response.data.token) {
        setSuccess('Registration successful!');
        alert('Registration successful!');
        setUserData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error('Error during registration:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred!';
      setError(errorMessage);
      alert(errorMessage); 
    }
  };
  
  

  return (
    <div className="max-w-md mx-auto mt-10 p-5  rounded">
      <h2 className="text-2xl text-gray-100 text-center font-bold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-100 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder='Enter Full Name'
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-100 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            placeholder='example@ex.com'
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-100 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder='Enter Password'
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-100 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            placeholder='Confirm Password'
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className='text-center'>
          <button
              type="submit"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
              Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
