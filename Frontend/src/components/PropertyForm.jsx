import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { ethers } from 'ethers';
import { contractInstance } from '../hooks/contractData';

const PropertyForm = ({contract, setContract}) => {
    const [property, setProperty] = useState({
        // country: '',
        // state: '',
        // city: '',
        address: '',
        images: null,
        description: '',
        furnishing: '',
        pricePerDay: '',
        depositMoney: '',
        area: '',
        type: '',
        parking: [],
        availableFrom: '',
        availableFor: [],
        minDays: '',
        maxDays: '',
        contactNumber: ''
    });

    const [loading, setLoading] = useState(false);
    const [uri, setUri] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const REACT_APP_PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlOWQwZDE4ZC1iOGMxLTRhYzctYjY1Zi1kZThkZmY2OWRhYjgiLCJlbWFpbCI6ImpheWVzaG55YWRhdjQ5N0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzBlZjgyZTE3YmRmNzUwZTQ5OTYiLCJzY29wZWRLZXlTZWNyZXQiOiI3ZmNkMTBmZGM3ZThlMGUwN2IyODY3YjdiMjc5MTY3ZjdiNzA4MjU5MzdiYTgxNmYwMzE1MTZiNjY1ZTFhOWJkIiwiZXhwIjoxNzYyNzg5MDAyfQ.PSTSabJMtIlH05GPBW6x9GSR4SngpQe5IZNklsaohoA";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty((prevProperty) => ({ ...prevProperty, [name]: value }));
    };

    const handleImageChange = (e) => {
        setProperty((prevProperty) => ({ ...prevProperty, images: e.target.files }));
    };

    const toggleSelection = (name, value) => {
        setProperty((prevProperty) => {
            const selectedValues = prevProperty[name];
            return {
                ...prevProperty,
                [name]: selectedValues.includes(value)
                    ? selectedValues.filter((item) => item !== value)
                    : [...selectedValues, value]
            };
        });
    };

    const uploadToIPFS = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const options = JSON.stringify({
            cidVersion: 0,
        });
        formData.append("pinataOptions", options);
        const metadata = JSON.stringify({
            name: file.name,
        });
        formData.append("pinataMetadata", metadata);

        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${REACT_APP_PINATA_JWT}`,
            },
            body: formData,
        });

        const resDataJson = await res.json();
        return `https://ipfs.io/ipfs/${resDataJson.IpfsHash}`;
    };

    const mintProperty = async (uri) => {
        try {
            // if(!contract){
                const contract = await contractInstance();
                setContract(contract);
                console.log("Contract: ", contract);
            // }

            const priceInWei = ethers.parseEther(property.pricePerDay);
            const pricePerUnitTime = BigInt(priceInWei) / BigInt(86400);
            console.log("price in wei: ",  priceInWei);
            console.log("price per unit time: ", pricePerUnitTime);
    
            const availableFrom = Math.floor(new Date(property.availableFrom).getTime() / 1000);
            console.log("available from: ", availableFrom);
    
            const minDays = parseInt(property.minDays, 10);
            const maxDays = parseInt(property.maxDays, 10);

    
            if (isNaN(minDays) || isNaN(maxDays)) {
                throw new Error("Invalid minimum or maximum days");
            }
    
            const minimumTime = BigInt(minDays * 86400);
            const maximumTime = BigInt(maxDays * 86400);
            console.log("min days: ", minimumTime);
            console.log("max days: ", maximumTime);
    
            const depositAmount = ethers.parseEther(property.depositMoney);
    
            await contract.mintProperty(
                uri,
                pricePerUnitTime,
                availableFrom,
                minimumTime,
                maximumTime,
                depositAmount
            );
            toast.success("Transaction confirmed!", {
                position: "top-center"
              })
        } catch (error) {
            console.error("Failed to mint property:", error);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            toast.info("Uploading images to IPFS", { position: "top-center" });

            if (!property.images) {
                throw new Error("No images selected");
            }

            const imageUrls = await Promise.all(
                Array.from(property.images).map((image) => uploadToIPFS(image))
            );

            toast.info("Images uploaded to IPFS!", { position: "top-center" });

            const propertyData = {
                ...property,
                images: imageUrls,
            };

            const data = JSON.stringify({
                pinataContent: propertyData,
                pinataMetadata: {
                    name: "PropertyData.json",
                },
            });

            toast.info("Uploading property data to IPFS", { position: "top-center" });

            const res2 = await fetch(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${REACT_APP_PINATA_JWT}`,
                        "Content-Type": "application/json",
                    },
                    body: data,
                }
            );

            if (!res2.ok) {
                throw new Error(`Failed to upload property data: ${res2.statusText}`);
            }

            const resData2 = await res2.json();
            const uri = resData2.IpfsHash;
            console.log("Property data saved to IPFS:", uri);
            if(uri.length === 0){
                throw new Error("Invalid Uri!.");
            }
            await mintProperty(uri);

            setSuccess('Property listed successfully!');
            // setProperty({
            //     // country: '',
            //     // state: '',
            //     // city: '',
            //     address: '',
            //     images: null,
            //     description: '',
            //     furnishing: '',
            //     depositMoney: '',
            //     area: '',
            //     type: '',
            //     parking: [],
            //     availableFrom: '',
            //     availableFor: [],
            //     minDays: '',
            //     maxDays: '',
            //     contactNumber: ''
            // });


        } catch (error) {
            console.error("Failed to upload property data to IPFS:", error);
            setError('Failed to list property.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-bold text-center mb-6">List Your Property</h2>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                

                <div>
                    <h3 className="text-xl font-semibold mb-2">Location</h3>
                    {/* <input className='hidden' type="text" name="country" value={property.country} onChange={handleChange} placeholder="Country" required />
                    <input className='hidden' type="text" name="state" value={property.state} onChange={handleChange} placeholder="State" required />
                    <input className='hidden' type="text" name="city" value={property.city} onChange={handleChange} placeholder="City" required /> */}
                    <input type="text" name="address" value={property.address} onChange={handleChange} placeholder="Address" required />
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Images / Videos</h3>
                    <input type="file" name="images" onChange={handleImageChange} multiple accept="image/*,video/*" required />
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Description</h3>
                    <textarea name="description" value={property.description} onChange={handleChange} placeholder="Description" required />
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Furnishing</h3>
                    <select name="furnishing" value={property.furnishing} onChange={handleChange} required>
                        <option value="" disabled>Select Furnishing</option>
                        <option value="furnished">Furnished</option>
                        <option value="unfurnished">Unfurnished</option>
                        <option value="semi-furnished">Semi-Furnished</option>
                    </select>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Price Per Day</h3>
                    <input type="number" name="pricePerDay" value={property.pricePerDay} onChange={handleChange} placeholder="Amount" required />
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Deposit Money</h3>
                    <input type="number" name="depositMoney" value={property.depositMoney} onChange={handleChange} placeholder="Amount" required />
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Area (sq ft)</h3>
                    <input type="number" name="area" value={property.area} onChange={handleChange} placeholder="Area in sq ft" required />
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Property Type</h3>
                    <select name="type" value={property.type} onChange={handleChange} required>
                        <option value="" disabled>Select Type</option>
                        <option value="1bhk">1BHK</option>
                        <option value="2bhk">2BHK</option>
                        <option value="3bhk">3BHK</option>
                        <option value="1rk">1RK</option>
                    </select>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Parking</h3>
                    <div className="flex gap-2">
                        {["car", "bike", "unavailable"].map(option => (
                            <div
                                key={option}
                                className={`p-2 border rounded cursor-pointer ${property.parking.includes(option) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => toggleSelection('parking', option)}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                {property.parking.includes(option) && <span> ✓</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Available From</h3>
                    <input type="date" name="availableFrom" value={property.availableFrom} onChange={handleChange} required />
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Available For</h3>
                    <div className="flex gap-2">
                        {["family", "bachelors"].map(option => (
                            <div
                                key={option}
                                className={`p-2 border rounded cursor-pointer ${property.availableFor.includes(option) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => toggleSelection('availableFor', option)}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                {property.availableFor.includes(option) && <span> ✓</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Range</h3>
                    <input type="number" name="minDays" value={property.minDays} onChange={handleChange} placeholder="Min Days" required />
                    <input type="number" name="maxDays" value={property.maxDays} onChange={handleChange} placeholder="Max Days" required />
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Contact Number</h3>
                    <input type="tel" name="contactNumber" value={property.contactNumber} onChange={handleChange} placeholder="Contact Number" required />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md">List Property</button>
            </form>
        </div>
    );
};

export default PropertyForm;
