import * as Hapi from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import GetSongsMongodb from '../repository/GetSongsMongodb';
import GetSongsUseCase from '../use-case/GetSongsUseCase';

export default class GetSongsRoute implements IRoute {
    async register(server: Hapi.Server, database: Database<any>): Promise<any> {
        const repository = new GetSongsMongodb(database);
        const useCase = new GetSongsUseCase(repository);

        server.route({
            method: 'GET',
            path: '/api/v1/songs',
            options: {
                validate: {
                    query: {
                        artistName: Joi.string().min(3).required(),
                        limit: Joi.number().integer().min(1).max(50).default(20),
                        offset: Joi.number().integer().min(0).default(0)
                    }
                }
            },
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    const { origin, pathname } = request.url;
                    const { artistName, limit, offset } = request.query;
                    const endpointPath = `${origin}${pathname}`;

                    const songs = await useCase.exec(endpointPath, artistName, limit, offset);

                    return h.response(songs);
                } catch (error) {
                    console.error('GetSongsRoute', error);
                    return h.response({ success: false, error });
                }
            }
        });
    }
}
