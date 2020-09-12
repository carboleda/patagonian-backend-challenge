import UseCase from "../../../domain/UseCase";

export default class SpofifyAuthUseCase extends UseCase<any> {
    async exec(clientId: string, secretKey: string): Promise<any> {
        return this.repository.exec(clientId, secretKey);
    }
}
