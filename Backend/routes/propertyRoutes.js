// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const { uploadFileToIPFS, uploadJSONToIPFS } = require('../services/pinataService');

// Route to handle property uploads
router.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).send({ error: 'Error parsing the form' });
        }

        try {
            // Upload images to IPFS
            const imageUrls = await Promise.all(
                Object.values(files).map(async (file) => {
                    return await uploadFileToIPFS(file);
                })
            );

            // Create property data JSON
            const propertyData = {
                ...fields,
                images: imageUrls,
            };

            const data = JSON.stringify({
                pinataContent: propertyData,
                pinataMetadata: { name: "PropertyData.json" }
            });

            // Upload property data JSON to IPFS
            const ipfsHash = await uploadJSONToIPFS(data);

            res.send({ ipfsHash });
        } catch (error) {
            console.error("Error uploading to IPFS:", error);
            res.status(500).send({ error: 'Error uploading to IPFS' });
        }
    });
});

module.exports = router;
