import UseCase from "../../../domain/UseCase";

export default class DatabasePingUseCase extends UseCase<any> {
    async exec(): Promise<boolean> {
        return await this.repository.exec();
    }
}
