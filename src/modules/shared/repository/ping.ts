import { Db } from "mongodb";
import Respository from "../../../domain/repository";

export default class PingRepository extends Respository<Db> {
    async exec(): Promise<boolean> {
        return await this.database.ping();
    }
}
