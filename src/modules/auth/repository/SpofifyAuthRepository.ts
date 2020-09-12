import { Methods } from "../../../datasource/rest-api/Client";
import Api from "../../../datasource/rest-api/Api";
import Respository from "../../../domain/Repository";
import * as base64 from 'base-64';
import * as qs from 'querystring';

export default class SpofifyAuthRepository extends Respository<Api> {
    async exec(clientId: string, secretKey: string): Promise<any> {
        const authorization = base64.encode(`${clientId}:${secretKey}`);
        const payload = qs.stringify({ grant_type: 'client_credentials' });

        const response = await this.dataSource.request({
            url: 'https://accounts.spotify.com/api/token',
            method: Methods.POST,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${authorization}`
            }
        }, payload);

        // TODO: VALIDATE HTTP STATUS AND THROW HANDLE ERROR

        return response.data;
    }
}
