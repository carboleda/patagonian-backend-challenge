import * as Hapi from '@hapi/hapi';
import IRoute from '../../../domain/route';
import PingUseCase from '../use-case/ping';
import PingRepository from '../repository/ping';
import Database from '../../../db/database';

export default class PingRoute implements IRoute {
    async register(server: Hapi.Server, database: Database<any>): Promise<any> {
        server.route({
            method: 'GET',
            path: '/ping',
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    const repository = new PingRepository(database);
                    const useCase = new PingUseCase(repository);
                    const pong = await useCase.exec();
                    return h.response({ success: pong });
                } catch (error) {
                    return h.response({ success: false, error });
                }
            }
        });
    }
}
