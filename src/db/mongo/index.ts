import { MongoClient, Db } from 'mongodb';
import Database from '../database';

export default class MongoDatabase implements Database<Db> {
    private _instance: MongoClient | null;
    private databaseName: string | undefined;

    constructor() {
        this._instance = null;
        this.databaseName = process.env.DATABASE_NAME;
    }

    async connect(): Promise<void> {
        // Connection URI
        const uri: string = process.env.DATABASE_CONNECTION_URI!!;

        // Create a new MongoClient
        this._instance = new MongoClient(uri, { useUnifiedTopology: true });

        // Connect the client to the server
        await this._instance.connect();
        console.log('Connected successfully to server');
    }

    async close(): Promise<void> {
        try {
            // Ensures that the client will close when you finish/error
            await this._instance?.close();
            console.log('Disconnected successfully from server');
        } catch(error) {
            console.error('Connection error');
        }
    }

    async ping(): Promise<boolean> {
        try {
            // Establish and verify connection
            await this._instance?.db(this.databaseName).command({ ping: 1 });
            console.log('Ping successfully to server');

            return true;
        } catch(error) {
            console.error('Connection error');
        }

        return false;
    }

    async getConnection(): Promise<Db> {
        if (this._instance === null) {
            throw new Error('Connection is unavailable');
        }

        return this._instance.db(this.databaseName);
    }
}