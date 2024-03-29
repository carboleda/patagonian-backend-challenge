import UseCase from "../../../domain/UseCase";
import Constants from "../../../helpers/Constants";

export default class GetAllAlbumsByArtistIdUseCase extends UseCase<any> {
    async exec(accessToken: string, tokenType: string, artistId: string): Promise<Array<string>> {
        const limit = Constants.SPOTIFY_API_PAGING.MAX_LIMIT!!;
        let offset = Constants.SPOTIFY_API_PAGING.DEFAULT_OFFSET;
        let hasMore = false;
        let albumIds = Array<string>();

        do {
            const response = await this.repository.exec(
                accessToken, tokenType, artistId, limit, offset
            );

            const ids = response.items.map((album: any) => album.id);
            albumIds = [...albumIds, ...ids];

            offset += limit;
            hasMore = response.next !== null;
        } while (hasMore);

        return albumIds;
    }
}
