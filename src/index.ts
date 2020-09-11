import Server from './server';
import MongoDatabase from './db/mongo';

const server = new Server(new MongoDatabase());
(async () => {
    await server.start();
})();

process.on('SIGINT', () => {
    console.info('Stopping hapi server');

    server.stop().then((error: any) => {
        console.info(`Server stopped`);
        process.exit(error ? 1 : 0);
    });
});


/*const base64 = require('base-64');

const text = '58f2b81f3d394d64b872fda6acbba3f3:3eaf69d122ff4e01bc919b4384386527';
const authorization = base64.encode(text);

console.log(authorization);

// curl -X "POST" -H "Authorization: Basic NThmMmI4MWYzZDM5NGQ2NGI4NzJmZGE2YWNiYmEzZjM6M2VhZjY5ZDEyMmZmNGUwMWJjOTE5YjQzODQzODY1Mjc=" -d grant_type=client_credentials https://accounts.spotify.com/api/token
*/
