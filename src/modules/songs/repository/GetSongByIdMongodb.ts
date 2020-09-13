import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";

export default class SaveSongsMongodb extends Respository<Database<Db>> {
    async exec(songId: string): Promise<any> {
        const db = await this.dataSource.getConnection();
        const filter = { id: songId };
        const projection = { _id: 0, available_markets: 0 };

        return await db.collection(MongoCollection.SONGS)
            .findOne(filter, { projection });
    }
}
