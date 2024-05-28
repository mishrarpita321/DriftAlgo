// src/scheduler.js
const processTleData = require('./controllers/tleController');
const detectDrift = require('./services/driftDectionService');

const scheduleTask = async () => {
    try {
        await processTleData();
        await detectDrift();
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
};

// Schedule to run every hour (3600000 ms)
// setInterval(scheduleTask, 3600000);

// scheduleTask();
