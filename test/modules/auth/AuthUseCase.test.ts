import LoadEnv from '../../../src/helpers/LoadEnv';
import Api from '../../../src/datasource/rest-api/Api';
import AxiosRequestClient from '../../../src/datasource/rest-api/AxiosRequestClient';
import AuthSpotify from '../../../src/modules/auth/repository/AuthSpotify';
import AuthUseCase from '../../../src/modules/auth/user-case/AuthUseCase';

describe('Test Spotify authorization', () => {
    let api: Api;
    let authRepository: AuthSpotify;
    let authUseCase: AuthUseCase;

    beforeAll(() => {
        api = new Api(new AxiosRequestClient());
        authRepository = new AuthSpotify(api);
        authUseCase = new AuthUseCase(authRepository);
    });

    test('Authorization is success when data is correct', async () => {
        try {
            // Arrange
            const clientId = LoadEnv.SPOTIFY_CLIENT_ID;
            const clientSecret = LoadEnv.SPOTIFY_CLIENT_SECRET;

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
            const clientId = 'awrongclientid';
            const clientSecret = 'awrongclientsecret';

            // Act
            const result = await authUseCase.exec(clientId, clientSecret);

            // Assert
            expect(result.access_token).toBeUndefined();
        } catch (error) {
            expect(error).not.toBeNull();
        }
    });
});
