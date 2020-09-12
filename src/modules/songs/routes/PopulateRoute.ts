import * as Hapi from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import IRoute from '../../../domain/IRoute';
import Api from '../../../datasource/rest-api/Api';
import AxiosRequestClient from '../../../datasource/rest-api/AxiosRequestClient';
import SpofifyAuthRepository from '../../auth/repository/SpofifyAuthRepository';
import GetAllByArtistIdSpotifyRepository from '../../albums/repository/GetAllByArtistIdSpotify';
import GetAllByArtistIdUseCase from '../../albums/use-case/GetAllByArtistIdUseCase';
import SpofifyAuthUseCase from '../../auth/user-case/SpofifyAuthUseCase';
import GetSongsByAlbumIdUseCase from '../use-case/GetSongsByAlbumIdUseCase';
import GetSongsByAlbumIdSpofifyRepository from '../repository/GetSongsByAlbumIdSpofify';

import PopulateUseCase from '../use-case/PopulateUseCase';
import SaveSongsDatabase from '../repository/SaveSongsDatabase';
import Database from '../../../datasource/database';

export default class DatabasePingRoute implements IRoute {
    async register(server: Hapi.Server, database: Database<any>): Promise<any> {
        const api = new Api(new AxiosRequestClient());
        server.route({
            method: 'GET',
            path: '/api/v1/songs/populate',
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    const { ids } = request.query;
                    const spofifyAuthRepository = new SpofifyAuthRepository(api);
                    const spofifyAuthUseCase = new SpofifyAuthUseCase(spofifyAuthRepository);
                    const getAllByArtistIdSpotifyRepository = new GetAllByArtistIdSpotifyRepository(api);
                    const getAllByArtistIdUseCase = new GetAllByArtistIdUseCase(getAllByArtistIdSpotifyRepository);
                    const getSongsByAlbumIdSpofifyRepository = new GetSongsByAlbumIdSpofifyRepository(api);
                    const getSongsByAlbumIdUseCase = new GetSongsByAlbumIdUseCase(getSongsByAlbumIdSpofifyRepository);

                    const repository = new SaveSongsDatabase(database);
                    const useCase = new PopulateUseCase(
                        repository, spofifyAuthUseCase, getAllByArtistIdUseCase, getSongsByAlbumIdUseCase
                    );

                    const clientId = process.env.SPOTIFY_CLIENT_ID!!;
                    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!!;
                    const result = await useCase.exec(clientId, clientSecret, ids);
                    return h.response(result);
                } catch (error) {
                    console.error(error);
                    return h.response({ success: false, error });
                }
            },
            options: {
                validate: {
                    query: {
                        ids: Joi.string().min(22).max(1149).required()
                    }
                }
            },
        });
    }
}
