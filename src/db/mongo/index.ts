import { throws } from 'assert';
import { MongoClient } from 'mongodb';
import Database from '../database';

export default class MongoDatabase implements Database<MongoClient> {
    private _instance: MongoClient | null;

    constructor() {
        this._instance = null;
    }

    async connect(): Promise<void> {
        // Connection URI
        const uri: string = process.env.DATABASE_CONNECTION_URI!!;
        console.log('uri', uri);

        // Create a new MongoClient
        this._instance = new MongoClient(uri, { useUnifiedTopology: true });

        // Connect the client to the server
        await this._instance.connect();
        await this.ping();
    }

    async close(): Promise<void> {
        try {
            // Ensures that the client will close when you finish/error
            await this._instance?.close();
            console.log('Disconnected successfully from server');
        } catch(error) {
            console.log('Connection error');
        }
    }

    async ping(): Promise<boolean> {
        try {
            // Establish and verify connection
            await this._instance?.db('songs').command({ ping: 1 });
            console.log('Connected successfully to server');

            return true;
        } catch(error) {
            console.log('Connection error');
        }

        return false;
    }

    async getConnection(): Promise<MongoClient> {
        if (this._instance === null) {
            throw new Error('Connection is unavailable');
        }

        return this._instance;
    }
}
