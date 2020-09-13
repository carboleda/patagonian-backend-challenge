import UseCase from "../../../domain/UseCase";

export default class AuthUseCase extends UseCase<any> {
    async exec(clientId: string, secretKey: string): Promise<any> {
        return await this.repository.exec(clientId, secretKey);
    }
}
