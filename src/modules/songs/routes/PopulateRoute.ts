import * as Hapi from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import IRoute from '../../../domain/IRoute';
import Database from '../../../datasource/database';
import Api from '../../../datasource/rest-api/Api';
import AxiosRequestClient from '../../../datasource/rest-api/AxiosRequestClient';
import AuthSpofify from '../../auth/repository/AuthSpofify';
import AuthUseCase from '../../auth/user-case/AuthUseCase';
import GetAllAlbumsByArtistIdSpotify from '../../albums/repository/GetAllAlbumsByArtistIdSpotify';
import GetAllAlbumsByArtistIdUseCase from '../../albums/use-case/GetAllAlbumsByArtistIdUseCase';
import GetSongsByAlbumIdSpofify from '../repository/GetSongsByAlbumIdSpofify';
import GetSongsByAlbumIdUseCase from '../use-case/GetSongsByAlbumIdUseCase';
import DeleteAllSongsMongodb from '../repository/DeleteAllSongsMongodb';
import DeleteAllSongsUseCase from '../use-case/DeleteAllSongsUseCase';

import PopulateUseCase from '../use-case/PopulateUseCase';
import SaveSongsMongodb from '../repository/SaveSongsMongodb';
import SpofityRequestError from '../../../domain/errors/SpofityRequestError';

export default class PopulateRoute implements IRoute {
    async register(server: Hapi.Server, database: Database<any>): Promise<any> {
        const api = new Api(new AxiosRequestClient());
        const authSpotify = new AuthSpofify(api);
        const authUseCase = new AuthUseCase(authSpotify);
        const getAllAlbumsByArtistIdSpotify = new GetAllAlbumsByArtistIdSpotify(api);
        const getAllAlbumsByArtistIdUseCase = new GetAllAlbumsByArtistIdUseCase(getAllAlbumsByArtistIdSpotify);
        const getSongsByAlbumIdSpofify = new GetSongsByAlbumIdSpofify(api);
        const getSongsByAlbumIdUseCase = new GetSongsByAlbumIdUseCase(getSongsByAlbumIdSpofify);
        const deleteAllSongsMongodb = new DeleteAllSongsMongodb(database);
        const deleteAllSongsUseCase = new DeleteAllSongsUseCase(deleteAllSongsMongodb);

        const repository = new SaveSongsMongodb(database);
        const useCase = new PopulateUseCase(
            repository, authUseCase, getAllAlbumsByArtistIdUseCase,
            getSongsByAlbumIdUseCase, deleteAllSongsUseCase
        );

        server.route({
            method: 'GET',
            path: '/api/v1/songs/populate',
            options: {
                validate: {
                    query: {
                        ids: Joi.string().min(22).max(689).required()
                    }
                }
            },
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    const { ids } = request.query;
                    const clientId = process.env.SPOTIFY_CLIENT_ID!!;
                    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!!;
                    const artistIds: Array<string> = ids.split(',');

                    const result = await useCase.exec(clientId, clientSecret, artistIds);

                    return h.response(result);
                } catch (error) {
                    console.error('PopulateRoute', error);
                    if (error instanceof SpofityRequestError) {
                        return h.response({ message: error.message }).code(error.code);
                    }
                    return h.response({ message: error.message });
                }
            }
        });
    }
}
