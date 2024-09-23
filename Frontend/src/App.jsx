import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import LandlordDashboard from './components/LandlordDashboard';
import TenantDashboard from './components/TenantDashboard';
import PropertyDetail from './pages/PropertyDetail';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import  useBlockchain from './hooks/useBlockchain'
import { Link } from 'react-router-dom';
import PropertyForm from './components/PropertyForm';
import './App.css';
import Register from './pages/Register';


const App = () => {
    const { connectWallet, account, connected } = useBlockchain();

    useEffect(() => {
        connectWallet();
    }, [connectWallet]);

    return (
        <div className='App'>
        <Router>
            <AuthProvider>
            <div className="h-auto">
                <div className="gradient-bg-welcome h-auto min-h-screen w-screen py-1">
                    <div class="fixed  backdrop-blur-sm">
                        <section class="relative mx-auto">
                            <nav class="flex justify-between text-white w-screen px-24">
                                <div class="px-5 xl:px-12 py-6 flex w-full items-center">
                                <Link to="/" className="text-xl font-bold px-4 hover:underline">Home</Link>
                                {/* <Link to="/signup" className="text-xl font-medium hover:underline">Sign Up</Link> */}
                                <Link to="/login" className="text-xl font-medium px-4 hover:underline">Login</Link>
                                </div>
                                <div className="flex items-center space-x-4">
                                <Link to="/landlord-dashboard" className="text-xl font-medium hover:underline">Landlord Dashboard</Link>
                                <Link to="/tenant-dashboard" className="text-xl font-medium hover:underline">Tenant Dashboard</Link>
                                </div>
                                {/* <div>
                               {!connected?<button
                                    onClick={connectWallet}
                                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Connect wallet
                                </button>: 
                                <button
                                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                Connected
                                </button>}
                                </div> */}
                            </nav>
                        </section>
                    </div> 
                    <main className="flex-grow container mx-auto p-6">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
                            <Route path="/tenant-dashboard" element={<TenantDashboard />} />
                            <Route path="/property/:propertyId" element={<PropertyDetail />} />
                            <Route path="/add-property" element={<PropertyForm />} />
                        </Routes>
                    </main>
                </div>
                </div>
            </AuthProvider>
        </Router>
        </div>
    );
};

export default App;