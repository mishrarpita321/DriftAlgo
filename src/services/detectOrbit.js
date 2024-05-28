const getOrbitalPath = async (satelliteNumber) => {
    try {
      const result = await session.run(
        'MATCH (s:Satellite {satelliteNumber: $satelliteNumber})-[:HAS_POSITION]->(p:Position) ' +
        'RETURN p ORDER BY p.timestamp',
        { satelliteNumber }
      );
  
      const positions = result.records.map(record => record.get('p').properties);
      return positions;
    } catch (error) {
      console.error('Error retrieving orbital path:', error);
      return null;
    }
  };
  
  // Example usage
  getOrbitalPath('00900')  // Replace with the actual satellite number
    .then(positions => {
      if (positions) {
        console.log('Orbital Path:', positions);
      } else {
        console.log('No data found for the specified satellite.');
      }
    });
  