import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'

const Home = () => {

    return (
        <div className='gradient-bg-welcome justify-center'>
            <header className="text-center py-12">
                <h1 className="text-3xl font-bold text-gray-400 mb-4">Welcome to the Blockchain Rental System</h1>
                <p className="text-xl text-gray-400 mb-8">Your go-to platform for seamless rental management on the blockchain.</p>
                <Link to="/signup" className="btn-primary"><span className='text-gray-200 text-2xl font-serif underline'>Get Started</span></Link>
            </header>
            <section className="container mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                    <div className="p-8 shadow-xl gradient-bg-welcome rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
                        <h2 className="text-2xl font-bold mb-4 text-gray-200">Easy Sign-Up</h2>
                        <p className="text-gray-200 mb-6">Quick and simple registration process to get you started in no time.</p>
                    </div>
                    <div className="p-8  shadow-xl gradient-bg-welcome rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
                        <h2 className="text-2xl font-bold mb-4 text-gray-200">Manage Properties</h2>
                        <p className="text-gray-200 mb-6">Efficient tools to manage your rental properties with ease.</p>
                    </div>
                    <div className="p-8  shadow-xl rounded-lg gradient-bg-welcome transition-transform transform hover:scale-105 duration-300 ease-in-out">
                        <h2 className="text-2xl font-bold mb-4 text-gray-200">Secure Transactions</h2>
                        <p className="text-gray-200 mb-6">Ensure safe and transparent transactions on the blockchain.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
