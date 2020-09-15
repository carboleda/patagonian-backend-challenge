import LoadEnv from '../../../src/helpers/LoadEnv';
import Api from '../../../src/datasource/rest-api/Api';
import MongoDatabase from '../../../src/datasource/database/mongo';
import AxiosRequestClient from '../../../src/datasource/rest-api/AxiosRequestClient';
import AuthSpotify from '../../../src/modules/auth/repository/AuthSpotify';
import AuthUseCase from '../../../src/modules/auth/user-case/AuthUseCase';
import GetAllAlbumsByArtistIdSpotify from '../../../src/modules/albums/repository/GetAllAlbumsByArtistIdSpotify';
import GetAllAlbumsByArtistIdUseCase from '../../../src/modules/albums/use-case/GetAllAlbumsByArtistIdUseCase';
import GetSongsByAlbumIdSpotify from '../../../src/modules/songs/repository/GetSongsByAlbumIdSpotify';
import GetSongsByAlbumIdUseCase from '../../../src/modules/songs/use-case/GetSongsByAlbumIdUseCase';
import DeleteAllSongsMongodb from '../../../src/modules/songs/repository/DeleteAllSongsMongodb';
import DeleteAllSongsUseCase from '../../../src/modules/songs/use-case/DeleteAllSongsUseCase';
import PopulateUseCase from '../../../src/modules/songs/use-case/PopulateUseCase';
import SaveSongsMongodb from '../../../src/modules/songs/repository/SaveSongsMongodb';

// Mocks


describe('Test get all albums by artist\'s id  from Spotify', () => {
    let api: Api;
    let database: MongoDatabase;
    let authSpotify: AuthSpotify;
    let authUseCase: AuthUseCase;
    let getAllAlbumsByArtistIdSpotify: GetAllAlbumsByArtistIdSpotify;
    let getAllAlbumsByArtistIdUseCase: GetAllAlbumsByArtistIdUseCase;
    let getSongsByAlbumIdSpotify: GetSongsByAlbumIdSpotify;
    let getSongsByAlbumIdUseCase: GetSongsByAlbumIdUseCase;
    let deleteAllSongsMongodb: DeleteAllSongsMongodb;
    let deleteAllSongsUseCase: DeleteAllSongsUseCase;
    let saveSongsMongodb: SaveSongsMongodb;
    let populateUseCase: PopulateUseCase;
    let albumsGoodResponse: any;
    let songsByAlbumGoodResponse: any;

    beforeAll((done: Function) => {
        database = new MongoDatabase();
        api = new Api(new AxiosRequestClient());
        authSpotify = new AuthSpotify(api);
        authUseCase = new AuthUseCase(authSpotify);
        getAllAlbumsByArtistIdSpotify = new GetAllAlbumsByArtistIdSpotify(api);
        getAllAlbumsByArtistIdUseCase = new GetAllAlbumsByArtistIdUseCase(getAllAlbumsByArtistIdSpotify);
        getSongsByAlbumIdSpotify = new GetSongsByAlbumIdSpotify(api);
        getSongsByAlbumIdUseCase = new GetSongsByAlbumIdUseCase(getSongsByAlbumIdSpotify);
        deleteAllSongsMongodb = new DeleteAllSongsMongodb(database);
        deleteAllSongsUseCase = new DeleteAllSongsUseCase(deleteAllSongsMongodb);

        saveSongsMongodb = new SaveSongsMongodb(database);
        populateUseCase = new PopulateUseCase(
            saveSongsMongodb, authUseCase, getAllAlbumsByArtistIdUseCase,
            getSongsByAlbumIdUseCase, deleteAllSongsUseCase
        );
        done();
    });

    beforeEach((done: Function) => {
        deleteAllSongsMongodb.exec = jest.fn(deleteAllSongsMongodb.exec)
            .mockReturnValue(Promise.resolve(true));
        saveSongsMongodb.exec = jest.fn(saveSongsMongodb.exec)
            .mockReturnValue(Promise.resolve({}));
        albumsGoodResponse = {
            items: Array.from(Array(2), (_, i: number) => ({ id: `${i}` })),
            limit: 2,
            offset: 0,
            next: null,
            previous: null,
            total: 308
        };
        songsByAlbumGoodResponse = {
            items: Array.from(Array(4), (_, i: number) => ({ id: '', name: `Name ${i}` })),
            limit: 2,
            offset: 0,
            next: null,
            previous: null,
            total: 308
        };
        done();
    });

    test('Authorization is success when data is correct', async () => {
        try {
            // Arrange
            const clientId = LoadEnv.SPOTIFY_CLIENT_ID;
            const clientSecret = LoadEnv.SPOTIFY_CLIENT_SECRET;
            const artistIds = ['53A0W3U0s8diEn9RhXQhVz', '0oSGxfWSnnOXhD2fKuz2Gy'];
            getAllAlbumsByArtistIdSpotify.exec = jest.fn(getAllAlbumsByArtistIdSpotify.exec)
                .mockReturnValue(Promise.resolve(albumsGoodResponse));
            getSongsByAlbumIdSpotify.exec = jest.fn(getSongsByAlbumIdSpotify.exec)
                .mockReturnValue(Promise.resolve(songsByAlbumGoodResponse));

            // Act
            const result = await populateUseCase.exec(clientId, clientSecret, artistIds);

            // Assert
            expect(result).toBeInstanceOf(Object);
            expect(getSongsByAlbumIdSpotify.exec).toBeCalledTimes(
                albumsGoodResponse.items.length * artistIds.length
            );
        } catch (error) {
            console.error(error);
            expect(error).toBeNull();
        }
    }, 100000);
});
