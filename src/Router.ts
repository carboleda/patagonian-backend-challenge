import * as Hapi from '@hapi/hapi';
import Database from './datasource/database';
import DatabasePingRoute from './modules/shared/routes/DatabasePingRoute';
import SongsPopulateRoute from './modules/songs/routes/PopulateRoute';

export default class Router {
    public static async loadRoutes(server: Hapi.Server, database: Database<any>): Promise<any> {
        console.info('Router - Start adding routes');

        await new DatabasePingRoute().register(server, database);
        await new SongsPopulateRoute().register(server, database);

        console.info('Router - Finish adding routes');
    }
}