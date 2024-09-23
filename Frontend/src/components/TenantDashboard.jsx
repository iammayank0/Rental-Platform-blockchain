import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TenantDashboard = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/tenant/rented-properties');
                // setProperties(response.data.properties);
            } catch (error) {
                setError('Failed to fetch rented properties.');
            } finally {
                setLoading(false);
            }
        };

        const fetchPaymentHistory = async () => {
            try {
                const response = await axios.get('/api/tenant/payment-history');
                // setPaymentHistory(response.data.history);
            } catch (error) {
                setError('Failed to fetch payment history.');
            }
        };

        fetchProperties();
        fetchPaymentHistory();
    }, []);

    const handleLogout = () => {
        // Perform logout operations
        navigate('/login');
    };

    const handlePayRent = (propertyId) => {
        navigate(`/pay-rent/${propertyId}`);
    };

    return (
        <div className='flex flex-col text-white flex justify-around items-center pt-32'>
            <header className="w-full">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-200">Tenant Dashboard</h1>
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
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-200">Rented Properties</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
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
                                                onClick={() => handlePayRent(property.id)}
                                                className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Pay Rent
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-200">Payment History</h2>
                            <div className="mt-4 bg-white shadow-lg rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paymentHistory.map((payment, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default TenantDashboard;
