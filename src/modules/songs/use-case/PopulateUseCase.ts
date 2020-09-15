import * as Bluebird from 'bluebird';
import Respository from "../../../domain/Repository";
import UseCase from "../../../domain/UseCase";
import GetAllAlbumsByArtistIdUseCase from "../../albums/use-case/GetAllAlbumsByArtistIdUseCase";
import AuthUseCase from "../../auth/user-case/AuthUseCase";
import GetSongsByAlbumIdUseCase from './GetSongsByAlbumIdUseCase';
import DeleteAllSongsUseCase from './DeleteAllSongsUseCase';
import Constants from '../../../helpers/Constants';
import Utilities from '../../../helpers/Utitlities';
import InvalidArtistIdError from '../../../domain/errors/InvalidArtistIdError';

export default class PopulateUseCase extends UseCase<any> {
    constructor(
        protected repository: Respository<any>,
        private authUseCase: AuthUseCase,
        private getAllAlbumsByArtistIdUseCase: GetAllAlbumsByArtistIdUseCase,
        private getSongsByAlbumIdUseCase: GetSongsByAlbumIdUseCase,
        private deleteAllSongsUseCase: DeleteAllSongsUseCase
    ) {
        super(repository);
    }

    /**
     * Loads into a database all the songs from a list of Artist's IDs from Spotify’s public Web API.
     * The getSongsByAlbumsAndSave function is not awaited because load songs is long process and a typical
     * http request has a shorter timeout than need.
     * @author carboleda
     * @date 2020-09-13
     * @param {string} clientId - Spotify client id
     * @param {string} clientSecret - Spotify client secret
     * @param {Array<string>} artistIds - A list of the Spotify Artist's IDs.
     * @returns {Promise<any>}
     * @memberof PopulateUseCase
     */
    async exec(clientId: string, clientSecret: string, artistIds: Array<string>): Promise<any> {
        const invalidArtistId = this.getInvalidArtistId(artistIds);
        if (invalidArtistId) {
            throw new InvalidArtistIdError(invalidArtistId);
        }

        const authResponse = await this.authUseCase.exec(clientId, clientSecret);

        await this.deleteAllSongsUseCase.exec();

        const albumIds = await this.getAlbumsForAllArtists(
            authResponse.access_token, authResponse.token_type, artistIds
        );

        this.getSongsByAlbumsAndSave(authResponse.access_token, authResponse.token_type, albumIds);

        return { artists: artistIds.length, albums: albumIds.length };
    }

    private getInvalidArtistId(artistIds: Array<string>): string | undefined {
        return artistIds.find(id => !Utilities.isValidArtistId(id));
    }

    private async getAlbumsForAllArtists(
        accessToken: string, tokenType: string, artistIds: Array<string>
    ): Promise<Array<string>> {
        const allAlbumIds = await Bluebird.map(artistIds, async (artistId: string, index: number) => {
            const albumIds = await this.getAllAlbumsByArtistIdUseCase.exec(
                accessToken, tokenType, artistId
            );
            console.debug(`getAlbumByArtist:: index: ${index}, artistId: ${artistId}, albums: ${albumIds.length}`);

            await Bluebird.delay(Constants.POPULATE_ALBUMS.DELAY);

            return albumIds;
        }, { concurrency: Constants.POPULATE_ALBUMS.CONCURRENCY });

        return allAlbumIds.reduce((accIds: Array<string>, albumIds: Array<string>) => {
            return [...accIds, ...albumIds];
        });
    }

    private async getSongsByAlbumsAndSave(accessToken: string, tokenType: string, albumIds: Array<string>) {
        await Bluebird.map(albumIds, async (albumId: string, index: number) => {
            const songs: Array<any> = await this.getSongsByAlbumIdUseCase.exec(
                accessToken, tokenType, albumId
            );
            console.debug(`getSongsByAlbumAndSave:: index: ${index}, albumId: ${albumId}, songs: ${songs.length}`);
            songs.forEach(song => console.log(song.name));

            await Bluebird.delay(Constants.POPULATE_SONGS.DELAY);

            return await this.repository.exec(songs);
        }, { concurrency: Constants.POPULATE_SONGS.CONCURRENCY });
    }
}
