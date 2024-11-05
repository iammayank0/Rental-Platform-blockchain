import React, { useState } from 'react';
import axios from 'axios';

const PropertyForm = () => {
    const [property, setProperty] = useState({
        country: '',
        state: '',
        city: '',
        address: '',
        images: null,
        description: '',
        furnishing: '',
        advanceMoney: '',
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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        for (const key in property) {
            if (key === 'images') {
                Array.from(property.images).forEach((file) => formData.append('images', file));
            } else {
                formData.append(key, property[key]);
            }
        }

        try {
            await axios.post('/api/properties', formData);
            setSuccess('Property listed successfully!');
            setProperty({
                country: '',
                state: '',
                city: '',
                address: '',
                images: null,
                description: '',
                furnishing: '',
                advanceMoney: '',
                area: '',
                type: '',
                parking: [],
                availableFrom: '',
                availableFor: [],
                minDays: '',
                maxDays: '',
                contactNumber: ''
            });
        } catch (error) {
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
                    <input className='hidden' type="text" name="country" value={property.country} onChange={handleChange} placeholder="Country" required />
                    <input className='hidden' type="text" name="state" value={property.state} onChange={handleChange} placeholder="State" required />
                    <input className='hidden' type="text" name="city" value={property.city} onChange={handleChange} placeholder="City" required />
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
                    <h3 className="text-xl font-semibold mb-2">Advance Money</h3>
                    <input type="number" name="advanceMoney" value={property.advanceMoney} onChange={handleChange} placeholder="Amount" required />
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
