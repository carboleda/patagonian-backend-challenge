import { runInThisContext } from "vm";
import UseCase from "../../../domain/use-case";

export default class PingUseCase extends UseCase<any> {
    async exec(): Promise<boolean> {
        return await this.repository.exec();
    }
}
