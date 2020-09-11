import Respository from './repository';

export default abstract class UseCase<DB> {
    constructor(protected repository: Respository<DB>) {}

    async exec(...args: any[]): Promise<any> {
        return this.repository.exec(args);
    }
}
