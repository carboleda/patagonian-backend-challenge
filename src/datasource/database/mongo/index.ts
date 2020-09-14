import LoadEnv from '../../../helpers/LoadEnv';
import { MongoClient, Db } from 'mongodb';
import Database from '../';

export enum MongoCollection {
    SONGS = 'songs'
}

export default class MongoDatabase implements Database<Db> {
    private _instance: MongoClient | null;

    constructor() {
        this._instance = null;
    }

    async connect(): Promise<void> {
        // Connection URI
        const uri: string = LoadEnv.DATABASE_CONNECTION_URI!!;

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
            await this._instance?.db().command({ ping: 1 });
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

        return this._instance.db();
    }
}
