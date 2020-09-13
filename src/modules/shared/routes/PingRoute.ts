import * as Hapi from '@hapi/hapi';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import PingUseCase from '../use-case/PingUseCase';
import PingMongodb from '../repository/PingMongodb';

export default class PingRoute implements IRoute {
    async register(server: Hapi.Server, database: Database<any>): Promise<any> {
        const repository = new PingMongodb(database);
        const useCase = new PingUseCase(repository);

        server.route({
            method: 'GET',
            path: '/api/v1/ping',
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    const pong = await useCase.exec();

                    return h.response({ pong });
                } catch (error) {
                    return h.response({ success: false, error });
                }
            }
        });
    }
}
