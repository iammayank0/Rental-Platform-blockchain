import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LandlordDashboard = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/landlord/properties');
                // setProperties(response.data.properties);
            } catch (error) {
                setError('Failed to fetch properties.');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleLogout = () => {
        // Perform logout operations
        navigate('/login');
    };

    const handleAddProperty = () => {
        navigate('/add-property');
    };

    return (
        <div className='text-white flex flex-col justify-around items-center pt-32'>
            <header className="w-full">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-200">Landlord Dashboard</h1>
                    <div className='text-center'>
                        <button
                            onClick={handleLogout}
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex justify-end mb-4">
                <div className='text-center'>
                        <button
                            onClick={handleAddProperty}
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Add Property
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {properties.map((property) => (
                            <div key={property.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <img
                                    className="w-full h-48 object-cover"
                                    src={property.image}
                                    alt={property.name}
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-gray-900">{property.name}</h3>
                                    <p className="text-gray-700 mt-2">{property.description}</p>
                                    <p className="text-gray-900 mt-4 font-bold">${property.price}/month</p>
                                    <button
                                        className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Manage
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default LandlordDashboard;
