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

    async exec(clientId: string, secretKey: string, ids: string): Promise<any> {
        const authResponse = await this.authUseCase.exec(clientId, secretKey);

        const artistIds: Array<string> = ids.split(',');

        await this.deleteAllSongsUseCase.exec();
        return await Promise.all(artistIds.map(async artistId => {
            const albumIds = await this.getAllAlbumsByArtistIdUseCase.exec(
                authResponse.access_token, authResponse.token_type, artistId
            );

            Bluebird.map(albumIds, async (albumId: string) => {
                await this.getSongsByAlbum(
                    authResponse.access_token, authResponse.token_type, albumId
                );

                await Bluebird.delay(Constants.POPULATE.DELAY);
            }, { concurrency: Constants.POPULATE.CONCURRENCY });

            return albumIds;
        }));
    }

    async getSongsByAlbum(accessToken: string, tokenType: string, albumId: string) {
        try {
            const songs: Array<any> = await this.getSongsByAlbumIdUseCase.exec(
                accessToken, tokenType, albumId
            );
            songs.forEach(song => console.log(song.name));
            return await this.repository.exec(songs);
        } catch (error) {
            console.error(`getSongsByAlbum::album(${albumId})`, error.message, error.config);
        }
    }
}
