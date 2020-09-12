import UseCase from "../../../domain/UseCase";

export default class GetSongsByAlbumIdUseCase extends UseCase<any> {
    async exec(accessToken: string, tokenType: string, albumId: string): Promise<Array<string>> {
        const limit = 50; //FIXME: EXTERNALIZE TO CONSTANTS
        let offset = 0;
        let hasMore = false;
        let songs = Array<any>();

        do {
            const response = await this.repository.exec(
                accessToken, tokenType, albumId, limit, offset
            );

            songs = [...songs, ...response.items];

            offset += limit;
            hasMore = response.next !== null;
        } while (hasMore);

        return songs;
    }
}
