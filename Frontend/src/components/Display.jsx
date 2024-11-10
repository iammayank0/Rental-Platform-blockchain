// PropertiesList.js

import React, { useState, useEffect } from 'react';
import { getProperties } from '../hooks/contractData';

const Display = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const propertiesData = await getProperties();
            console.log("Properties: " + propertiesData);
            setProperties(propertiesData);
            console.log("Properties: " + properties);

        };

        fetchProperties();
    }, []);
    if(!properties){
        return (
            <div className='text-9xl'>
            No properties found!
            </div>
        )
    }

    return (
        <div>
            <h1>Properties</h1>
            <ul>
                {properties.map((property, index) => (
                    <li key={index}>
                        <h2>{property.address}</h2>
                        <p>Description: {property.description}</p>
                        <p>Furnishing: {property.furnishing}</p>
                        <p>Price per Day: {property.pricePerDay} ETH</p>
                        <p>Deposit: {property.depositMoney} ETH</p>
                        <p>Area: {property.area} sqft</p>
                        <p>Type: {property.type}</p>
                        <p>Parking: {property.parking ? "Available" : "Not Available"}</p>
                        <p>Available From: {property.availableFrom}</p>
                        <p>Available For: {property.availableFor}</p>
                        <p>Minimum Days: {property.minDays}</p>
                        <p>Maximum Days: {property.maxDays}</p>
                        <p>Contact Number: {property.contactNumber}</p>
                        <p>Owner: {property.owner}</p>
                        <p>Status: {property.isAvailable ? "Available" : "Not Available"}</p>
                        {property.images && property.images.map((image, imgIndex) => (
                            <img key={imgIndex} src={image} alt={`Property ${index} Image ${imgIndex}`} />
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Display;
