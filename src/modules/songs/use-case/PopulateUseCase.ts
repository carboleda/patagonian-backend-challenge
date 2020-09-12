import * as Bluebird from 'bluebird';
import Respository from "../../../domain/Repository";
import UseCase from "../../../domain/UseCase";
import GetAllByArtistIdUseCase from "../../albums/use-case/GetAllByArtistIdUseCase";
import SpofifyAuthUseCase from "../../auth/user-case/SpofifyAuthUseCase";
import GetSongsByAlbumIdUseCase from './GetSongsByAlbumIdUseCase';

export default class PopulateUseCase extends UseCase<any> {
    constructor(
        protected repository: Respository<any>,
        private spofifyAuthUseCase: SpofifyAuthUseCase,
        private getAllByArtistIdUseCase: GetAllByArtistIdUseCase,
        private getSongsByAlbumIdUseCase: GetSongsByAlbumIdUseCase
    ) {
        super(repository);
    }

    async exec(clientId: string, secretKey: string, ids: string): Promise<any> {
        const authResponse = await this.spofifyAuthUseCase.exec(clientId, secretKey);

        const artistIds: Array<string> = ids.split(',');

        return await Promise.all(artistIds.map(async id => {
            const albumIds = await this.getAllByArtistIdUseCase.exec(
                authResponse.access_token, authResponse.token_type, id
            );

            Bluebird.map(albumIds, async (albumId: string) => {
                await this.getSongsByAlbum(
                    authResponse.access_token, authResponse.token_type, albumId
                );

                await Bluebird.delay(5000);
            }, { concurrency: 10 });

            return albumIds;
        }));
    }

    async getSongsByAlbum(accessToken: string, tokenType: string, albumId: string) {
        try {
            const songs: Array<any> = await this.getSongsByAlbumIdUseCase.exec(accessToken, tokenType, albumId);
            songs.forEach(song => console.log(song.name));
            return await this.repository.exec(songs);
        } catch (error) {
            console.error(`getSongsByAlbum::album(${albumId})`, error.message, error.config);
            //await this.getSongsByAlbum(accessToken, tokenType, albumId);
        }
    }
}
