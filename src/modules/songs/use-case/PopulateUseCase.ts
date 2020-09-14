import * as Bluebird from 'bluebird';
import Respository from "../../../domain/Repository";
import UseCase from "../../../domain/UseCase";
import GetAllAlbumsByArtistIdUseCase from "../../albums/use-case/GetAllAlbumsByArtistIdUseCase";
import AuthUseCase from "../../auth/user-case/AuthUseCase";
import GetSongsByAlbumIdUseCase from './GetSongsByAlbumIdUseCase';
import DeleteAllSongsUseCase from './DeleteAllSongsUseCase';
import Constants from '../../../helpers/Constants';

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

    async exec(clientId: string, clientSecret: string, artistIds: Array<string>): Promise<any> {
        const authResponse = await this.authUseCase.exec(clientId, clientSecret);

        await this.deleteAllSongsUseCase.exec();

        const albumIds = await this.getAlbumByArtist(
            authResponse.access_token, authResponse.token_type, artistIds
        );

        this.getSongsByAlbumAndSave(authResponse.access_token, authResponse.token_type, albumIds);

        return { artists: artistIds.length, albums: albumIds.length };
    }

    async getAlbumByArtist(
        accessToken: string, tokenType: string, artistIds: Array<string>
    ): Promise<Array<string>> {
        const matAlbumIds = await Bluebird.map(artistIds, async (artistId: string, index: number) => {
            const albumIds = await this.getAllAlbumsByArtistIdUseCase.exec(
                accessToken, tokenType, artistId
            );
            console.debug(`getAlbumByArtist:: index: ${index}, artistId: ${artistId}, albums: ${albumIds.length}`);

            await Bluebird.delay(Constants.POPULATE_ALBUMS.DELAY);

            return albumIds;
        }, { concurrency: Constants.POPULATE_ALBUMS.CONCURRENCY });

        return matAlbumIds.reduce((accIds: Array<string>, albumIds: Array<string>) => {
            return [...accIds, ...albumIds];
        });
    }

    async getSongsByAlbumAndSave(accessToken: string, tokenType: string, albumIds: Array<string>) {
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
