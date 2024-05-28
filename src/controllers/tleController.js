// src/controllers/tleController.js
const fetchTleData = require('../utils/fetchTleData');
const saveTleData = require('../services/tleService');

const processTleData = async () => {
    const data = await fetchTleData();
    await saveTleData(data);
};

module.exports = processTleData;
