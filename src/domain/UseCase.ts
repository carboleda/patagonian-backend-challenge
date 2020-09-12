import Respository from './Repository';

export default abstract class UseCase<T> {
    constructor(protected repository: Respository<T>) {}

    abstract async exec(...args: any[]): Promise<any>;
}
