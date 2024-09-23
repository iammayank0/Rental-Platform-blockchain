import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PaymentHistory from '../components/PaymentHistory';

const PropertyDetail = () => {
    const { propertyId } = useParams();
    const [property, setProperty] = useState(null);
    const [rentAmount, setRentAmount] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                const response = await axios.get(`/api/rentals/property/${propertyId}`);
                setProperty(response.data);
            } catch (error) {
                console.error('Error fetching property details', error);
            }
        };

        fetchPropertyDetails();
    }, [propertyId]);

    const handlePayRent = async () => {
        try {
            await axios.post('/api/rentals/payrent', { propertyId, amount: rentAmount });
            alert('Rent paid successfully in Ether.');
        } catch (error) {
            console.error('Error paying rent', error);
        }
    };

    const handlePayRentWithToken = async () => {
        try {
            await axios.post('/api/rentals/payrent-token', { propertyId, amount: tokenAmount });
            alert('Rent paid successfully with token.');
        } catch (error) {
            console.error('Error paying rent with token', error);
        }
    };

    return (
        <div className="property-detail-page">
            {property ? (
                <>
                    <h1>Property Details</h1>
                    <p>Address: {property.address}</p>
                    <p>Token URI: {property.tokenURI}</p>
                    <PaymentHistory propertyId={propertyId} />
                    <div className="rent-payment">
                        <h2>Pay Rent</h2>
                        <input
                            type="number"
                            placeholder="Amount in Ether"
                            value={rentAmount}
                            onChange={(e) => setRentAmount(e.target.value)}
                        />
                        <button onClick={handlePayRent}>Pay Rent in Ether</button>
                        <input
                            type="number"
                            placeholder="Amount in Token"
                            value={tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value)}
                        />
                        <button onClick={handlePayRentWithToken}>Pay Rent with Token</button>
                    </div>
                </>
            ) : (
                <p>Loading property details...</p>
            )}
        </div>
    );
};

export default PropertyDetail;
