import UseCase from "../../../domain/use-case";

export default class SpofifyAuthUseCase extends UseCase<any> {
    async exec(clientId: string, secretKey: string): Promise<any> {
        return this.repository.exec(clientId, secretKey);
    }
}
