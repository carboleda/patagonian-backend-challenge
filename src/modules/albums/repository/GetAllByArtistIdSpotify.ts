import { Methods } from "../../../datasource/rest-api/Client";
import Api from "../../../datasource/rest-api/Api";
import Respository from "../../../domain/Repository";

export default class GetAllByArtistIdSpotify extends Respository<Api> {
    async exec(
        accessToken: string, tokenType: string,
        artistId: string, limit: number = 20, offset: number = 0
    ): Promise<any> {
        const response = await this.dataSource.request({
            url: 'https://api.spotify.com/v1/artists/{artistId}/albums?limit={limit}&offset={offset}',
            method: Methods.GET,
            headers: {
                Authorization: `${tokenType} ${accessToken}`
            }
        }, { artistId, limit, offset });

        // TODO: VALIDATE HTTP STATUS AND THROW HANDLE ERROR

        return response.data;
    }
}
