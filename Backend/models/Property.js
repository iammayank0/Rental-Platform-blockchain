const mongoose = require('mongoose');

const RentalPropertySchema = new mongoose.Schema({
    tokenId: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    tokenURI: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    rentAmount: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

export default mongoose.model('RentalProperty', RentalPropertySchema);
