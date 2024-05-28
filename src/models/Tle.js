// src/models/Tle.js
const mongoose = require('mongoose');

const SatelliteDataSchema = new mongoose.Schema({
    satelliteNumber: String,
    name: String,
    epoch: Date,
    latitude: Number,
    longitude: Number,
    altitude: Number,
    line1: String,
    line2: String
});

module.exports = mongoose.model('Tle', SatelliteDataSchema);
