// services/ipfs/ipfsService.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const dotenv  = require('dotenv');
dotenv.config({ path: './config.env' });


const PINATA_API_URL = 'https://api.pinata.cloud/pinning';
const PINATA_JWT = process.env.PINATA_JWT; // Ensure this is set in your environment variables

// Function to upload a file to IPFS
const uploadFileToIPFS = async (file) => {
    try{
        if (!file) {
            throw new Error("No file provided");
          }
        const formData = new FormData();
        formData.append('file', file.buffer);
        const options = JSON.stringify({ cidVersion: 0 });
        formData.append("pinataOptions", options);
        const metadata = JSON.stringify({
            name: "name",
          });
          formData.append("pinataMetadata", metadata);
    
        const response = await axios.post(
            `${PINATA_API_URL}/pinFileToIPFS`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${PINATA_JWT}`,
                    ...formData.getHeaders()
                }
            }
        );
    
        return `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw new Error('IPFS upload failed');
      }

};

// Function to upload JSON data to IPFS
const uploadJSONToIPFS = async (data) => {
    try{

    }catch(e){

    }
    const response = await axios.post(
        `${PINATA_API_URL}/pinJSONToIPFS`,
        data,
        {
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.IpfsHash;
};

module.exports = {
    uploadFileToIPFS,
    uploadJSONToIPFS
};
