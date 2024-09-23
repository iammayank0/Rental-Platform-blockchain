
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
    <div className="max-w-md mx-auto mt-10 p-5 border border-gray-300 rounded">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
