import UseCase from "../../../domain/UseCase";

export default class GetAllAlbumsByArtistIdUseCase extends UseCase<any> {
    async exec(accessToken: string, tokenType: string, artistId: string): Promise<Array<string>> {
        const limit = 50; //FIXME: EXTERNALIZE TO CONSTANTS
        let offset = 0;
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
