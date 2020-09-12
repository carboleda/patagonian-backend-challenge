import * as Hapi from '@hapi/hapi';
import Database from './datasource/database';
import DatabasePingRoute from './modules/shared/routes/DatabasePingRoute';
import PopulateSongsRoute from './modules/songs/routes/PopulateRoute';
import GetSongsRoute from './modules/songs/routes/GetSongsRoute';
import GetSongByIdRoute from './modules/songs/routes/GetSongByIdRoute';

export default class Router {
    public static async loadRoutes(server: Hapi.Server, database: Database<any>): Promise<any> {
        console.info('Router - Start adding routes');

        await new DatabasePingRoute().register(server, database);
        await new PopulateSongsRoute().register(server, database);
        await new GetSongsRoute().register(server, database);
        await new GetSongByIdRoute().register(server, database);

        console.info('Router - Finish adding routes');
    }
}
