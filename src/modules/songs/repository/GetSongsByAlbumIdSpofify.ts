import { Methods } from "../../../datasource/rest-api/Client";
import Constants from "../../../helpers/Constants";
import Api from "../../../datasource/rest-api/Api";
import Respository from "../../../domain/Repository";
import SpofityRequestError from "../../../domain/errors/SpofityRequestError";

export default class GetSongsByAlbumIdSpofify extends Respository<Api> {
    private static URL: string = 'https://api.spotify.com/v1/albums/{albumId}/tracks?limit={limit}&offset={offset}';

    async exec(
        accessToken: string, tokenType: string, albumId: string,
        limit: number = Constants.MY_API_PAGING.DEFAULT_LIMIT,
        offset: number = Constants.MY_API_PAGING.DEFAULT_OFFSET
    ): Promise<any> {
        try {
            const response = await this.dataSource.request({
                url: GetSongsByAlbumIdSpofify.URL,
                method: Methods.GET,
                headers: {
                    Authorization: `${tokenType} ${accessToken}`
                }
            }, { albumId, limit, offset });

            return response.data;
        } catch(error) {
            throw new SpofityRequestError(error);
        }
    }
}
