import * as Hapi from '@hapi/hapi';
import { glob } from 'glob';
import * as Path from 'path';
import Database from './datasource/database';

export default class Router {
    public static async loadRoutes(server: Hapi.Server, database: Database<any>): Promise<any> {
        try {
            console.info('Router - Start adding routes');
            glob(
                'modules/*/routes/*.+(js|ts)', { cwd: __dirname },
                (error: Error | null, files: Array<string>) => {
                    if (error) {
                        console.error('Router - Error loading route files');
                        return;
                    }

                    console.info(`Router - Found ${files.length} routes`);
                    files.forEach(async (filePath: string) => {
                        console.info(Path.relative('./', Path.join(__dirname, filePath)));
                        const RouteClass = require(Path.join(__dirname, filePath)).default;
                        await new RouteClass().register(server, database);
                    });
                }
            );
            console.info('Router - Finish adding routes');
        } catch (error) {
            console.error('Router - Error loading route files', error);
        }
    }
}
