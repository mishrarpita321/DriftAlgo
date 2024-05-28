// src/services/tleService.js
const Tle = require('../models/Tle');
const parseTleData = require('../utils/parseTleData');

const saveTleData = async (data) => {
    const tleEntries = data.split('\n').filter(line => line.trim().length > 0);
    for (let i = 0; i < tleEntries.length; i += 3) {
        const parsedData = parseTleData(tleEntries[i], tleEntries[i + 1], tleEntries[i + 2]);
        const tleDoc = new Tle(parsedData);
        // const tleDoc = await Tle.findOneAndUpdate({ satelliteNumber: parsedData.satelliteNumber }, parsedData, { upsert: true });
        await tleDoc.save();
    }
};

module.exports = saveTleData;
