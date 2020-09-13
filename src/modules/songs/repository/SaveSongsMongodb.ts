import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";

export default class SaveSongsMongodb extends Respository<Database<Db>> {
    async exec(songs: any): Promise<any> {
        const db = await this.dataSource.getConnection();
        return await db.collection(MongoCollection.SONGS).insertMany(songs);
    }
}
