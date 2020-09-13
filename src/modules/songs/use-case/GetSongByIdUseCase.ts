import UseCase from "../../../domain/UseCase";
import SongNotFoundError from "../../../domain/errors/SongNotFoundError";

export default class GetSongsByAlbumIdUseCase extends UseCase<any> {
    async exec(songId: string): Promise<any> {
        const song = await this.repository.exec(songId);

        if (!song) {
            throw new SongNotFoundError();
        }

        return song;
    }
}
