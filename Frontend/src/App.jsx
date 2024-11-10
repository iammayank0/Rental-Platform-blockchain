import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import LandlordDashboard from './components/LandlordDashboard';
import TenantDashboard from './components/TenantDashboard';
import Display from './components/Display';
import PropertyDetail from './pages/PropertyDetail';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { Link } from 'react-router-dom';
import PropertyForm from './components/PropertyForm';
import './App.css';
import Register from './pages/Register';
import { connectWallet } from './hooks/connectWallet';
import { BrowserProvider } from 'ethers';
import abi from './contract/abi.json'
import { Contract } from 'ethers';



const App = () => {
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const contractAddress = '0xe12049a66792C836bcE6d0f48093Cef736DF6Baf';


    const handleConnect = async() => {
        try {
        const account = await connectWallet();
        setAccount(account);
        console.log(account);
        setConnected(true);
        } catch (error) {
            console.error("Error connecting to wallet: ", error);
        }
    }

    // const contractData = async() => {
    //     try {
    //         if(window.ethereum){
    //             const provider = new BrowserProvider(window.ethereum);
    //             const signer = await provider.getSigner();
    //             const contract = new Contract(contractAddress, abi, signer);
    //             console.log("Contract: ", contract);
    //             setContract(contract);
    //             console.log("Contract: ", contract);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // useEffect(() => {
    //    const  {contractInstance} = await contractData()
    //         const contract = contractInstance();
    //         console.log()
    //         setContract(contract);
    // }, [connected, account]);

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
                                        <Link to="/display" className="text-xl font-medium px-4 hover:underline">properties</Link>
                                        </div>
                                        {/* <div className="flex items-center space-x-4">
                                        <Link to="/landlord-dashboard" className="text-xl font-medium hover:underline">Landlord Dashboard</Link>
                                        <Link to="/tenant-dashboard" className="text-xl font-medium hover:underline">Tenant Dashboard</Link>
                                        </div> */}
                                        <div>
                                    {!connected?<button
                                            onClick={handleConnect}
                                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                        >
                                            Connect wallet
                                        </button>: 
                                        <div className="flex items-center space-x-4">
                                        <Link to="/landlord-dashboard" className="text-xl font-medium hover:underline">Landlord Dashboard</Link>
                                        <Link to="/tenant-dashboard" className="text-xl font-medium hover:underline">Tenant Dashboard</Link>
                                        </div>}
                                        </div>
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
                                    <Route path="/add-property" element={<PropertyForm contract = {contract} account = {account} setContract = {setContract} />} />
                                    <Route path="/display" element={<Display/>}></Route>
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