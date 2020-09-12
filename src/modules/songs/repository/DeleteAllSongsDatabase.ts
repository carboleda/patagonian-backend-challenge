import { Db } from "mongodb";
import Database from "../../../datasource/database";
import Respository from "../../../domain/Repository";

export default class DeleteAllSongsDatabase extends Respository<Database<Db>> {
    async exec(): Promise<any> {
        const db = await this.dataSource.getConnection();
        // FIXME: EXTERNALIZE COLLECTION NAME
        return await db.collection('songs').deleteMany({});
    }
}
