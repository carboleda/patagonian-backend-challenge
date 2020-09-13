import { Db } from "mongodb";
import Database from "../../../datasource/database";
import Respository from "../../../domain/Repository";

export default class PingMongodb extends Respository<Database<Db>> {
    async exec(): Promise<boolean> {
        return await this.dataSource.ping();
    }
}
