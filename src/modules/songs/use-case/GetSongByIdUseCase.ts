import UseCase from "../../../domain/UseCase";

export default class GetSongsByAlbumIdUseCase extends UseCase<any> {
    async exec(songId: string): Promise<any> {
        const song = await this.repository.exec(songId);

        if (!song) {
            throw new Error('Song not found');
        }

        return song;
    }
}
