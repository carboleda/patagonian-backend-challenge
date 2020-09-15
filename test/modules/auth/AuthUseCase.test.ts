import LoadEnv from '../../../src/helpers/LoadEnv';
import Api from '../../../src/datasource/rest-api/Api';
import AxiosRequestClient from '../../../src/datasource/rest-api/AxiosRequestClient';
import AuthSpotify from '../../../src/modules/auth/repository/AuthSpotify';
import AuthUseCase from '../../../src/modules/auth/user-case/AuthUseCase';

describe('Test Spotify authorization', () => {
    test('Authorization is success when data is correct', async () => {
        try {
            // Arrange
            const api = new Api(new AxiosRequestClient());
            const authRepository = new AuthSpotify(api);
            const authUseCase = new AuthUseCase(authRepository);
            const clientId = LoadEnv.SPOTIFY_CLIENT_ID;
            const clientSecret = LoadEnv.SPOTIFY_CLIENT_SECRET;
            console.log(clientId, clientSecret);

            // Act
            const result = await authUseCase.exec(clientId, clientSecret);

            // Assert
            expect(result.access_token).toBeDefined();
        } catch (error) {
            expect(error).toBeNull();
        }
    });

    test('Authorization is failed when data is wrong', async () => {
        try {
            // Arrange
            const api = new Api(new AxiosRequestClient());
            const authRepository = new AuthSpotify(api);
            const authUseCase = new AuthUseCase(authRepository);
            const clientId = 'abadclientid';
            const clientSecret = 'abadclientsecret';

            // Act
            const result = await authUseCase.exec(clientId, clientSecret);

            // Assert
            expect(result.access_token).toBeUndefined();
        } catch (error) {
            expect(error).not.toBeNull();
        }
    });
});
