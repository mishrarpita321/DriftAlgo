const satellite = require('satellite.js');
const Tle = require('../models/Tle'); // Assuming Tle.js defines the MongoDB schema for TLE data

// Function to calculate position and velocity
const calculatePositionAndVelocity = (tleLine1, tleLine2, timestamp) => {
  const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
  const positionAndVelocity = satellite.propagate(satrec, timestamp);
  const positionEci = positionAndVelocity.position;
  const gmst = satellite.gstime(timestamp);
  const positionGd = satellite.eciToGeodetic(positionEci, gmst);
  const longitude = satellite.degreesLong(positionGd.longitude);
  const latitude = satellite.degreesLat(positionGd.latitude);
  const altitude = positionGd.height;

  return { longitude, latitude, altitude };
};

// Function to detect drift
const detectDrift = (currentTle, previousTle, threshold) => {
  const now = new Date();
  const previousTimestamp = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  const currentPosition = calculatePositionAndVelocity(currentTle.line1, currentTle.line2, now);
  const previousPosition = calculatePositionAndVelocity(previousTle.line1, previousTle.line2, previousTimestamp);

  const drift = {
    latitude: Math.abs(currentPosition.latitude - previousPosition.latitude),
    longitude: Math.abs(currentPosition.longitude - previousPosition.longitude),
    altitude: Math.abs(currentPosition.altitude - previousPosition.altitude)
  };

  return {
    drift,
    isDrifting: drift.latitude > threshold.latitude || drift.longitude > threshold.longitude || drift.altitude > threshold.altitude
  };
};

// Function to predict path for the next 24 hours
const predictPath = (tle, startTime, endTime, interval) => {
  const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
  let predictions = [];

  for (let time = startTime; time <= endTime; time.setMinutes(time.getMinutes() + interval)) {
    const position = calculatePositionAndVelocity(tle.line1, tle.line2, new Date(time));
    predictions.push({
      time: new Date(time),
      latitude: position.latitude,
      longitude: position.longitude,
      altitude: position.altitude
    });
  }

  return predictions;
};

module.exports = {
  detectDrift,
  predictPath
};
