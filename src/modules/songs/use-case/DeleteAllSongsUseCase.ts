import UseCase from "../../../domain/UseCase";

export default class DeleteAllSongsUseCase extends UseCase<any> {
    async exec(): Promise<boolean> {
        await this.repository.exec();
        return true;
    }
}
