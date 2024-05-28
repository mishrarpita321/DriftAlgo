// var neo4j = require('neo4j-driver');
// const connectNeo4j = async () => {
//   // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
//   const URI = 'bolt://localhost:7687'
//   const USER = 'neo4j'
//   const PASSWORD = '12345678'
  // let driver

//   try {
//     driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
//     const serverInfo = await driver.getServerInfo()
//     console.log('Neo4J Connection established')
//     console.log(serverInfo)
//   } catch(err) {
//     console.log(`Connection error\n${err}\nCause: ${err.cause}`)
//   }
// }


// module.exports = {connectNeo4j};




const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

module.exports = {
  connectNeo4jDB: async function() {
    try {
      // await driver.verifyConnectivity();
      console.log('Neo4j connected');
    } catch (error) {
      console.error('Neo4j connection error:', error);
    }
  },
  neo4jDriver: driver
};