import _ from '../../load-env';
import Api from '../../../src/datasource/rest-api/api';
import AxiosRequestClient from '../../../src/datasource/rest-api/axios-client';
import SpofifyAuthRepository from '../../../src/modules/auth/repository/spofify-auth';
import SpofifyAuthUseCase from '../../../src/modules/auth/user-case/spofify-auth';

describe('Test spotify authorization', () => {
    test('Authorization is success when data is correct', async () => {
        // Arrange
        const api = new Api(new AxiosRequestClient());
        const spofifyAuthRepository = new SpofifyAuthRepository(api);
        const spofifyAuthUseCase = new SpofifyAuthUseCase(spofifyAuthRepository);
        const clientId = '58f2b81f3d394d64b872fda6acbba3f3';
        const secretKey = '3eaf69d122ff4e01bc919b4384386527';

        try {
            // Act
            const result = await spofifyAuthUseCase.exec(clientId, secretKey);

            // Assert
            expect(result.access_token).toBeDefined();
        } catch (error) {
            expect(error).toBeNull();
        }
    });

    test('Authorization is failed when data is wrong', async () => {
        // Arrange
        const api = new Api(new AxiosRequestClient());
        const spofifyAuthRepository = new SpofifyAuthRepository(api);
        const spofifyAuthUseCase = new SpofifyAuthUseCase(spofifyAuthRepository);
        const clientId = 'abc';
        const secretKey = 'def';

        try {
            // Act
            const result = await spofifyAuthUseCase.exec(clientId, secretKey);

            // Assert
            expect(result.access_token).toBeUndefined();
        } catch (error) {
            expect(error).not.toBeNull();
        }
    });
});
