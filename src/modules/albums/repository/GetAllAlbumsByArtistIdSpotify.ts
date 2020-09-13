import { Methods } from "../../../datasource/rest-api/Client";
import Constants from "../../../helpers/Constants";
import Api from "../../../datasource/rest-api/Api";
import Respository from "../../../domain/Repository";
import SpofityRequestError from "../../../domain/errors/SpofityRequestError";

export default class GetAllAlbumsByArtistIdSpotify extends Respository<Api> {
    private static URL: string = 'https://api.spotify.com/v1/artists/{artistId}/albums?limit={limit}&offset={offset}';

    async exec(
        accessToken: string, tokenType: string, artistId: string,
        limit: number = Constants.SPOFIFY_API_PAGING.DEFAULT_LIMIT,
        offset: number = Constants.SPOFIFY_API_PAGING.DEFAULT_OFFSET
    ): Promise<any> {
        try {
            const response = await this.dataSource.request({
                url: GetAllAlbumsByArtistIdSpotify.URL,
                method: Methods.GET,
                headers: {
                    Authorization: `${tokenType} ${accessToken}`
                }
            }, { artistId, limit, offset });

            return response.data;
        } catch(error) {
            throw new SpofityRequestError(error);
        }
    }
}
