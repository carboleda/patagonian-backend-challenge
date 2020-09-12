import * as Hapi from '@hapi/hapi';
import IRoute from '../../../domain/IRoute';
import DatabasePingUseCase from '../use-case/DatabasePingUseCase';
import DatabasePingRepository from '../repository/DatabasePingRepository';
import Database from '../../../datasource/database';

export default class DatabasePingRoute implements IRoute {
    async register(server: Hapi.Server, database: Database<any>): Promise<any> {
        server.route({
            method: 'GET',
            path: '/api/v1/ping',
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    const repository = new DatabasePingRepository(database);
                    const useCase = new DatabasePingUseCase(repository);
                    const pong = await useCase.exec();
                    return h.response({ success: pong });
                } catch (error) {
                    return h.response({ success: false, error });
                }
            }
        });
    }
}
