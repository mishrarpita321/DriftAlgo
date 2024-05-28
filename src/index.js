// src/index.js
const connectDB = require('./config/mongodb');
const connectNeo = require('./config/neo4jdb');
const express = require('express');
const app = express();
const processTleData = require('./controllers/tleController');
const scheduleTask = require('./scheduler');
const routes = require('./routes/routes');
const cors = require('cors');
const port = process.env.PORT || 5000;
const fetchStoreDataNeo = require('./utils/fetchStoreSataNeo')

const detectDrift = require('./services/driftDectionService');

app.use('/api', routes);
app.use(cors(
    {
        origin: '*'
    }
));

const start = async () => {
    await connectDB();
    await connectNeo.connectNeo4jDB();
    // await processTleData();
    // console.log('TLE data processing completed');
    // process.exit(0);
};

app.listen(port, () => {
    console.log(`App running on ${port}`);
});

start();
fetchStoreDataNeo();
// detectDrift();
// scheduleTask();