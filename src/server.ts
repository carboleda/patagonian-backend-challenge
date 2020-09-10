import * as DotEnv from 'dotenv';
import * as Hapi from '@hapi/hapi';
import { MongoClient } from 'mongodb';

export default class Server {
    private static _instance: Hapi.Server;

    public static async start() {
        DotEnv.config({ path: `${process.cwd()}/.env` });

        Server._instance = Hapi.server({
            port: 8888,
            host: '0.0.0.0'
        });

        await Server._instance.start();
        console.log('Server running on %s', Server._instance.info.uri);

        Server._instance.route({
            method: 'GET',
            path: '/hello',
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    await Server.ping();
                    return h.response({ success: true });
                } catch (error) {
                    console.error(error);
                    return h.response({ success: false, error });
                }
            }
        });
    };

    public static async stop() {
        Server._instance.stop();
    }

    static async ping() {
        // Connection URI
        const host = process.env.DATABASE_HOST;
        const port = process.env.DATABASE_PORT;
        const user = process.env.DATABASE_USER;
        const pwd = process.env.DATABASE_PWD;
        //const uri = "mongodb://carboleda:patagonian@172.0.1.3:27017/?poolSize=20&w=majority";
        const uri = `mongodb://${user}:${pwd}@${host}:${port}/?poolSize=20&w=majority`;

        // Create a new MongoClient
        const client = new MongoClient(uri, { useUnifiedTopology: true });

        try {
            // Connect the client to the server
            await client.connect();

            // Establish and verify connection
            await client.db("songs").command({ ping: 1 });
            console.log("Connected successfully to server");
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
}
