import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const response = await axios.post('/api/signup', { email, password });
            if (response.data.success) {
                navigate('/login');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className='text-white h-full w-full flex justify-around items-center pt-32'>
            <div className=" shadow-xl rounded-lg p-8 max-w-md w-full">
                <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Sign Up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder='example@ex.com'
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            placeholder='Enter Password'
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">Confirm Password</label>
                        <input
                            type="password"
                            id="password"
                            value={confirmPassword}
                            placeholder='Enter Password'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className='text-center'>
                        <button
                            type="submit"
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Log in</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
