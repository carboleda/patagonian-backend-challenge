import Database from '../db/database';

export default abstract class Respository<T> {
    constructor(protected database: Database<T>) {}

    async exec(...args: any[]): Promise<any> {
        return null;
    }
}
