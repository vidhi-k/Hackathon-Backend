const mongoose = require('mongoose');
// const {isEmail} = require('validator');
// const bcrypt = require('bcrypt');

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Can't be blank"]
    },
    contact: {
        type: Number,
        required: [true, "Can't be blank"]
    },
    latitude: {
        type: Number,
        // required: [true, "Can't be blank"]
    },
    longitude: {
        type: Number,
        // required: [true, "Can't be blank"]
    },
    businessName: {
        type: String,
        required: [true, "Can't be blank"]
    },
    address: {
        type: String,
        required: [true, "Can't be blank"]
    },
    category: {
        type: String,
        required: [true, "Can't be blank"]
    },
    description: {
        type: String
    },
    listOfItems: {
        type: [String],
        required: [true, "Can't be blank"]
    }
});

const Shop = new mongoose.model("Shop", shopSchema);
module.exports = Shop