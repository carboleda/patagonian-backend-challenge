import * as Hapi from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import GetSongByIdMongodb from '../repository/GetSongByIdMongodb';
import GetSongByIdUseCase from '../use-case/GetSongByIdUseCase';
import ApiError from '../../../domain/errors/ApiError';

export default class GetSongByIdRoute implements IRoute {
    async register(server: Hapi.Server, database: Database<any>): Promise<any> {
        const repository = new GetSongByIdMongodb(database);
        const useCase = new GetSongByIdUseCase(repository);

        server.route({
            method: 'GET',
            path: '/api/v1/songs/{songId}',
            options: {
                validate: {
                    params: {
                        songId: Joi.string().min(22).max(22).required()
                    }
                }
            },
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    const { songId } = request.params;

                    const song = await useCase.exec(songId);

                    return h.response(song);
                } catch (error) {
                    console.error('GetSongByIdRoute', error);
                    if (error instanceof ApiError) {
                        return h.response({ message: error.message }).code(error.code);
                    }
                    return h.response({ message: error.message });
                }
            }
        });
    }
}
