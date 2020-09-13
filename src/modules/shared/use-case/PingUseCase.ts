import UseCase from "../../../domain/UseCase";

export default class PingUseCase extends UseCase<any> {
    async exec(): Promise<boolean> {
        return await this.repository.exec();
    }
}
