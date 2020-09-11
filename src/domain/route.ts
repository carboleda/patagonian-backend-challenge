import * as Hapi from '@hapi/hapi';
import Database from '../db/database';

export default interface IRoute {
    register(server: Hapi.Server, database: Database<any>): Promise<any>;
}
