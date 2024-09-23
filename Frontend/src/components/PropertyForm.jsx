import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PropertyForm = () => {
    const navigate = useNavigate();
    const [property, setProperty] = useState({
        title: '',
        description: '',
        address: '',
        price: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty((prevProperty) => ({ ...prevProperty, [name]: value }));
    };

    const handleImageChange = (e) => {
        setProperty((prevProperty) => ({ ...prevProperty, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const formData = new FormData();
        for (const key in property) {
            formData.append(key, property[key]);
        }
        try {
            await axios.post('/api/properties', formData);
            setSuccess('Property listed successfully!');
            setProperty({
                title: '',
                description: '',
                address: '',
                price: '',
                image: ''
            });
        } catch (error) {
            setError('Failed to list property.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className='text-white flex justify-around items-center pt-32'>

            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-200">List Your Property</h2>
                </div>
                {loading && (
                    <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                {error && <div className="text-red-500 text-center">{error}</div>}
                {success && <div className="text-green-500 text-center">{success}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label for="title" class="block mb-2 text-sm font-medium text-gray-200 dark:text-white">Title</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={property.title}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Title"
                            />
                        </div>
                        <div>
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-200 dark:text-white">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                value={property.description}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Description"
                            />
                        </div>
                        <div>
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-200 dark:text-white">Address</label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                required
                                value={property.address}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Address"
                            />
                        </div>
                        <div>
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-200 dark:text-white">Price</label>
                            <input
                                id="price"
                                name="price"
                                type="text"
                                required
                                value={property.price}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Price"
                            />
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-200 dark:text-white" for="user_avatar">Upload Image</label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                required
                                onChange={handleImageChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Image"
                            />
                        </div>
                    </div>
                    <div className='text-center'>
                        <button
                            type="submit"
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            List Property
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default PropertyForm;
