import * as Base64 from 'base-64';
import * as Qs from 'querystring';
import { Methods } from "../../../datasource/rest-api/Client";
import Api from "../../../datasource/rest-api/Api";
import Respository from "../../../domain/Repository";
import SpotifyRequestError from "../../../domain/errors/SpotifyRequestError";

export default class AuthSpotify extends Respository<Api> {
    private static URL: string = 'https://accounts.spotify.com/api/token';

    async exec(clientId: string, clientSecret: string): Promise<any> {
        const authorization = Base64.encode(`${clientId}:${clientSecret}`);
        const payload = Qs.stringify({ grant_type: 'client_credentials' });

        try {
            const response = await this.dataSource.request({
                url: AuthSpotify.URL,
                method: Methods.POST,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${authorization}`
                }
            }, payload);

            return response.data;
        } catch(error) {
            throw new SpotifyRequestError(error);
        }
    }
}
