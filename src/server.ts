import * as DotEnv from 'dotenv';
import * as Hapi from '@hapi/hapi';
import Database from './db/database';

export default class Server {
    private _instance: Hapi.Server | null;

    constructor(private database: Database<any>) {
        this._instance = null;
    }

    public async start() {
        DotEnv.config({ path: `${process.cwd()}/.env` });

        this._instance = Hapi.server({
            port: 8888,
            host: '0.0.0.0'
        });

        await this._instance.start();
        await this.database.connect();
        console.log('Server running on %s', this._instance.info.uri);

        this._instance.route({
            method: 'GET',
            path: '/hello',
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    await this.database.ping();
                    return h.response({ success: true });
                } catch (error) {
                    console.error(error);
                    return h.response({ success: false, error });
                }
            }
        });
    };

    public async stop() {
        this._instance?.stop();
    }
}
