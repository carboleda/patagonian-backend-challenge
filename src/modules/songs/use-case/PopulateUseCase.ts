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
        return await Bluebird.reduce(artistIds, async (accIds: Array<string>, artistId: string) => {
            const albumIds = await this.getAllAlbumsByArtistIdUseCase.exec(
                accessToken, tokenType, artistId
            );

            return [...accIds, ...albumIds];
        }, []);
    }

    async getSongsByAlbumAndSave(accessToken: string, tokenType: string, albumIds: Array<string>) {
        await Bluebird.map(albumIds, async (albumId: string) => {
            try {
                const songs: Array<any> = await this.getSongsByAlbumIdUseCase.exec(
                    accessToken, tokenType, albumId
                );
                songs.forEach(song => console.log(song.name));

                return await this.repository.exec(songs);
            } catch (error) {
                console.error(`getSongsByAlbum::album(${albumId})`, error.message);
            } finally {
                await Bluebird.delay(Constants.POPULATE.DELAY);
            }
        }, { concurrency: Constants.POPULATE.CONCURRENCY });
    }
}
