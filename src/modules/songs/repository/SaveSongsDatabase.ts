import { Db } from "mongodb";
import Database from "../../../datasource/database";
import Respository from "../../../domain/Repository";

export default class SaveSongsDatabase extends Respository<Database<Db>> {
    async exec(songs: any): Promise<any> {
        const db = await this.dataSource.getConnection();
        return await db.collection('songs').insertMany(songs);
    }
}
