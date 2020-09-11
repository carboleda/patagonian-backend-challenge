import { Db } from "mongodb";
import Database from "../../../datasource/database";
import Respository from "../../../domain/repository";

export default class PingRepository extends Respository<Database<Db>> {
    async exec(): Promise<boolean> {
        return await this.dataSource.ping();
    }
}
