import * as Hapi from '@hapi/hapi';
import Database from './datasource/database';
import PingRoute from './modules/shared/routes/ping';

export default class Router {
    public static async loadRoutes(server: Hapi.Server, database: Database<any>): Promise<any> {
        console.info('Router - Start adding routes');

        await new PingRoute().register(server, database);

        console.info('Router - Finish adding routes');
    }
}
