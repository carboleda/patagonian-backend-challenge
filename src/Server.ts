import * as DotEnv from 'dotenv';
import * as Hapi from '@hapi/hapi';
import Database from './datasource/database';
import Router from './Router';

export default class Server {
    private _instance: Hapi.Server | null = null;

    constructor(private database: Database<any>) {}

    public async start() {
        DotEnv.config({ path: `${process.cwd()}/.env` });

        // TODO: EXTERNALIZE PORT IN .ENV OR DOCKER-COMPOSE FILE
        this._instance = Hapi.server({
            port: 8888,
            host: '0.0.0.0'
        });
        this._instance.validator(require('@hapi/joi'));
        this._instance.ext('onPreHandler', (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            const { href } = request.url;
            console.debug(`onPreHandler::request ${request.method} > ${href}`);
            return h.continue;
        });

        await Router.loadRoutes(this._instance, this.database);
        await this._instance.start();
        await this.database.connect();
        console.log('Server running on %s', this._instance.info.uri);
    };

    public async stop() {
        this._instance?.stop();
    }
}
