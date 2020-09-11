export default abstract class Respository<T> {
    constructor(protected dataSource: T) {}

    abstract async exec(...args: any[]): Promise<any>;
}
