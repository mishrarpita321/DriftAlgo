// src/utils/parseTleData.js
const satellite = require('satellite.js');

const parseTleData = (name, line1, line2) => {
    console.log("name", name);
    console.log("line1", line1);
    console.log("line2", line2);
    const satrec = satellite.twoline2satrec(line1, line2);
    console.log("satrec", satrec);
    const epochYear = satrec.epochyr;
    const epochDay = satrec.epochdays;
    const epochDate = new Date(Date.UTC(2000 + epochYear, 0, 1));
    epochDate.setUTCDate(epochDate.getUTCDate() + epochDay - 1);

    const positionAndVelocity = satellite.propagate(satrec, new Date());
    const positionEci = positionAndVelocity.position;

    const gmst = satellite.gstime(new Date());
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

    const latitude = satellite.degreesLat(positionGd.latitude);
    const longitude = satellite.degreesLong(positionGd.longitude);
    const altitude = positionGd.height;

    return {
        satelliteNumber: satrec.satnum,
        epoch: epochDate,
        name,
        latitude,
        longitude,
        altitude,
        meanMotion: satrec.meanmotion,
        eccentricity: satrec.eccentricity,
        line1,
        line2
    };
};

module.exports = parseTleData;