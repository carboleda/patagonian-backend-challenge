import _ from '../../LoadEnv';
import Api from '../../../src/datasource/rest-api/Api';
import AxiosRequestClient from '../../../src/datasource/rest-api/AxiosRequestClient';
import AuthSpofify from '../../../src/modules/auth/repository/AuthSpofify';
import AuthUseCase from '../../../src/modules/auth/user-case/AuthUseCase';

describe('Test spotify authorization', () => {
    test('Authorization is success when data is correct', async () => {
        // Arrange
        const api = new Api(new AxiosRequestClient());
        const authRepository = new AuthSpofify(api);
        const authUseCase = new AuthUseCase(authRepository);
        const clientId = '58f2b81f3d394d64b872fda6acbba3f3';
        const secretKey = '3eaf69d122ff4e01bc919b4384386527';

        try {
            // Act
            const result = await authUseCase.exec(clientId, secretKey);

            // Assert
            expect(result.access_token).toBeDefined();
        } catch (error) {
            expect(error).toBeNull();
        }
    });

    test('Authorization is failed when data is wrong', async () => {
        // Arrange
        const api = new Api(new AxiosRequestClient());
        const authRepository = new AuthSpofify(api);
        const authUseCase = new AuthUseCase(authRepository);
        const clientId = 'abadclientid';
        const secretKey = 'abadsecretkey';

        try {
            // Act
            const result = await authUseCase.exec(clientId, secretKey);

            // Assert
            expect(result.access_token).toBeUndefined();
        } catch (error) {
            expect(error).not.toBeNull();
        }
    });
});
