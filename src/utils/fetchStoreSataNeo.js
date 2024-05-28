const fetchTleData = require('./fetchTleData');
const satellite = require('satellite.js');
const parseTleData = require('./parseTleData');
const neo4jdb = require('../config/neo4jdb');

const fetchAndStoreTLEData = async () => {
    const satellites = await fetchTleData();
    console.log("satellites", satellites);

    for (const satellite of satellites) {
        await insertData(satellite);
    }
    async function insertData(data) {
        const session = neo4jdb.neo4jDriver.session({ database: 'satellites' });
        // session=neo4jdb.neo4jDriver.session({database: 'satellite'});

        try {
            const result = await session.writeTransaction(tx =>
                tx.run(
                    `CREATE (s:Satellite {
                OBJECT_NAME: $OBJECT_NAME,
                OBJECT_ID: $OBJECT_ID,
                EPOCH: $EPOCH,
                MEAN_MOTION: $MEAN_MOTION,
                ECCENTRICITY: $ECCENTRICITY,
                INCLINATION: $INCLINATION,
                RA_OF_ASC_NODE: $RA_OF_ASC_NODE,
                ARG_OF_PERICENTER: $ARG_OF_PERICENTER,
                MEAN_ANOMALY: $MEAN_ANOMALY,
                EPHEMERIS_TYPE: $EPHEMERIS_TYPE,
                CLASSIFICATION_TYPE: $CLASSIFICATION_TYPE,
                NORAD_CAT_ID: $NORAD_CAT_ID,
                ELEMENT_SET_NO: $ELEMENT_SET_NO,
                REV_AT_EPOCH: $REV_AT_EPOCH,
                BSTAR: $BSTAR,
                MEAN_MOTION_DOT: $MEAN_MOTION_DOT,
                MEAN_MOTION_DDOT: $MEAN_MOTION_DDOT
              })`,
                    {
                        OBJECT_NAME: data.OBJECT_NAME,
                        OBJECT_ID: data.OBJECT_ID,
                        EPOCH: data.EPOCH,
                        MEAN_MOTION: data.MEAN_MOTION,
                        ECCENTRICITY: data.ECCENTRICITY,
                        INCLINATION: data.INCLINATION,
                        RA_OF_ASC_NODE: data.RA_OF_ASC_NODE,
                        ARG_OF_PERICENTER: data.ARG_OF_PERICENTER,
                        MEAN_ANOMALY: data.MEAN_ANOMALY,
                        EPHEMERIS_TYPE: data.EPHEMERIS_TYPE,
                        CLASSIFICATION_TYPE: data.CLASSIFICATION_TYPE,
                        NORAD_CAT_ID: data.NORAD_CAT_ID,
                        ELEMENT_SET_NO: data.ELEMENT_SET_NO,
                        REV_AT_EPOCH: data.REV_AT_EPOCH,
                        BSTAR: data.BSTAR,
                        MEAN_MOTION_DOT: data.MEAN_MOTION_DOT,
                        MEAN_MOTION_DDOT: data.MEAN_MOTION_DDOT
                    }
                )
            );

            // console.log(`Satellite ${data.OBJECT_NAME} created with id ${result.records[0].get('id')}`);
        } catch (error) {
            console.error('Error inserting data into Neo4j:', error);
        } finally {
            await session.close();
        }
    }



    // let data = [];
    // try {
    //     const tleData = await fetchTleData();
    //     const tleEntries = tleData.split('\n').filter(line => line.trim().length > 0);
    //     const data = [];
    //     for (let i = 0; i < tleEntries.length; i += 3) {
    //         const parsedData = parseTleData(tleEntries[i], tleEntries[i + 1], tleEntries[i + 2]);
    //         data.push(parsedData);
    //     }
    //     // await saveTleData(data);
    //     console.log("data", data);

    //     (data.map(async (tle) => {
    //         const { SATELLITE_NAME: name, NORAD_CAT_ID: satelliteNumber, TLE_LINE1: line1, TLE_LINE2: line2 } = tle;
    //         const satrec = satellite.twoline2satrec(line1, line2);

    //         // Clear previous data for the satellite
    //         await session.run(
    //             'MATCH (s:Satellite {satelliteNumber: $satelliteNumber})-[r:HAS_POSITION]->(p:Position) DELETE r, p',
    //             { satelliteNumber }
    //         );

    //         // Create or update satellite node
    //         await session.run(
    //             'MERGE (s:Satellite {satelliteNumber: $satelliteNumber}) SET s.name = $name, s.line1 = $line1, s.line2 = $line2',
    //             { satelliteNumber, name, line1, line2 }
    //         );

    //         // Calculate positions and store in Neo4j
    //         for (let i = 0; i < 144; i++) {  // 144 intervals of 10 minutes in 24 hours
    //             const currentDate = new Date(Date.now() + i * 10 * 60 * 1000);  // 10-minute increments
    //             const positionAndVelocity = satellite.propagate(satrec, currentDate);

    //             if (positionAndVelocity.position) {
    //                 const gmst = satellite.gstime(currentDate);
    //                 const positionEci = positionAndVelocity.position;
    //                 const positionGd = satellite.eciToGeodetic(positionEci, gmst);
    //                 const latitude = satellite.degreesLat(positionGd.latitude);
    //                 const longitude = satellite.degreesLong(positionGd.longitude);
    //                 const altitude = positionGd.height;

    //                 // Store position in Neo4j
    //                 await session.run(
    //                     'MATCH (s:Satellite {satelliteNumber: $satelliteNumber}) ' +
    //                     'CREATE (p:Position {timestamp: $timestamp, latitude: $latitude, longitude: $longitude, altitude: $altitude}) ' +
    //                     'CREATE (s)-[:HAS_POSITION]->(p)',
    //                     {
    //                         satelliteNumber, 
    //                         timestamp: currentDate.toISOString(),
    //                         latitude,
    //                         longitude,
    //                         altitude
    //                     })
    //                     .then((result) => {
    //                         result.records.forEach(record => {
    //                             // console.log(record._fields[0].properties);
    //                             console.log("hji");
    //                         });

    //                     })
    //                     .catch((error) => {
    //                         console.error('Error storing position data:', error);
    //                     });
    //             }
    //         }
    //     }));
    //     console.log('Satellite data successfully fetched and stored in Neo4j.');
    // } catch (error) {
    //     console.error('Error fetching or processing TLE data:', error);
    // }
};

module.exports = fetchAndStoreTLEData;
// Schedule data fetch every 30 minutes
// setInterval(fetchAndStoreTLEData, 30 * 60 * 1000);

// Fetch data immediately on startup
// fetchAndStoreTLEData();
